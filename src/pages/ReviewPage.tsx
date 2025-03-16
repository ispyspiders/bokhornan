import * as Yup from "yup";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { url } from "../types/auth.types";
import { Review } from "../types/review.types";
import { FloppyDisk, SpinnerGap, WarningCircle, X } from "@phosphor-icons/react";
import StarRating from "../components/StarRating";

interface FormData {
    rating: number,
    comment: string
}

interface ErrorsData {
    rating: string | null,
    comment: string | null,
    message: string | null
}

const ReviewPage = () => {
    const { reviewId } = useParams<{ reviewId: string }>();
    const [formData, setFormData] = useState<FormData>({ rating: 0, comment: '' });
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<ErrorsData>({ rating: null, comment: null, message: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();


    const getReview = async () => {
        setLoading(true);
        try {
            setLoading(true);
            const resp = await fetch(`${url}/review/${reviewId}`, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("bookToken")
                }
            });
            if (!resp.ok) {
                throw Error;
            }
            const data = await resp.json();
            setReview(data);
            setFormData({ comment: data.comment, rating: data.rating })
            setErrors({ rating: null, comment: null, message: null });
        } catch (error) {
            setErrors({ ...errors, message: "Något gick fel vid inläsning av recension" })
        } finally {
            setLoading(false);
        }
    }

    // valideringsschema
    const validationSchema = Yup.object({
        rating: Yup.number().integer().positive().min(1, "Vänligen ange ett betyg mellan 1 och 5 stärnor").max(5, "Vänligen ange ett betyg mellan 1 och 5 stärnor").required("Vänligen ange ett betyg mellan 1 och 5 stärnor"),
        comment: Yup.string().required("Kommentar får ej vara tomt").max(255, "Kommentar får ej vara längre än 255 tecken"),
    });

    // Ta emot betyg
    const handleRatingChange = (newRating: number) => {
        setFormData({ ...formData, rating: newRating });
        setErrors({ ...errors, rating: null })
    };

    // Hantera ändring i kommentar
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newComment = e.target.value;
        setFormData({ ...formData, comment: newComment });
        //Om felmeddelande finns, ta bort om användare börjar skriva
        if (errors.comment) {
            setErrors((prevErrors) => ({ ...prevErrors, comment: null }));
        }
    };

    // Skicka formulär/uppdatera review
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSuccess(false);
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const update = {
                rating: formData.rating,
                comment: formData.comment
            };

            // Lyckad validering, skicka data till API
            const response = await fetch(`${url}/review/${reviewId}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("bookToken")
                },
                body: JSON.stringify(update),
            });

            if (!response.ok) throw Error;
            setSuccess(true);

        } catch (validationErrors) {
            if (validationErrors instanceof Yup.ValidationError) {
                console.error("Valideringsfel: ", validationErrors);
                const errorMessages: ErrorsData = { rating: null, comment: null, message: null };
                validationErrors.inner.forEach((err: Yup.ValidationError) => {
                    if (err.path === "rating") errorMessages.rating = err.message;
                    if (err.path === "comment") errorMessages.comment = err.message;
                });
                setErrors(errorMessages);
            }
            else {
                console.error("Ett oväntat fel vid validering: ", validationErrors);
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        getReview();
    }, [reviewId]);

    return (
        <div className='p-4 py-12 md:p-12'>
            <h2>Redigera recension</h2>

            {loading && (
                <div className='bg-light rounded-lg p-4 my-12 mx-auto drop-shadow-sm flex'>
                    Läser in recension... <SpinnerGap size={24} className="animate-spin ms-2" />
                </div>
            )}
            <div className='bg-light rounded-lg p-4 mx-auto drop-shadow-sm'>

                {success && (
                    <div className="bg-green-500 bg-opacity-10 border-2 border-green-500 rounded-md p-2 my-4 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <WarningCircle size={24} className="text-green-500 me-2" />
                            Recension uppdaterad!
                        </div>
                        <button type="button" className="flex items-center px-4" onClick={() => setSuccess(false)}>Stäng <X size={24} className="ms-2" /></button>
                    </div>
                )}
                {!loading && errors.message && (
                    <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                        <WarningCircle size={24} className="text-coral me-2" /> {errors.message}
                    </div>
                )}
                <p className="font-montserrat">Du recenserar: <Link to={`/book/${review?.book_id}`} className="font-medium hover:underline">{review?.book_title}</Link></p>
                <form onSubmit={handleSubmit}>

                    <div className="flex flex-col text-dark-light text-sm sm:flex-row sm:items-center">
                        <StarRating onRatingChange={handleRatingChange} rating={formData.rating} size={36} />
                        {
                            formData.rating > 0 &&
                            <span className="sm:ms-2 text-lg">{formData.rating} / 5 </span>
                        }
                        {
                            errors.rating && <span className="text-sm font-light mt-2 ms-2 text-red-500">{errors.rating}</span>
                        }
                    </div>

                    <textarea
                        name="comment"
                        id="comment"
                        rows={4}
                        className="w-full mt-4 py-2 px-4 rounded border border-blush-mid focus:outline-coral focus:bg-blush-light"
                        onChange={handleCommentChange}
                        value={formData.comment}
                    >
                    </textarea>
                    {
                        errors.comment && <span className="text-sm font-light mt-2 ms-2 text-red-500">{errors.comment}</span>
                    }


                    <div className="w-full flex justify-end">
                        <button type="button" onClick={() => navigate(-1)} className="bg-blush-mid m-0 mt-4 me-8 px-4 hover:bg-opacity-80"
                        >
                            Avbryt
                        </button>

                        <button
                            type="submit"
                            className="m-0 mt-4 ps-6 pe-3 flex items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span className="flex">
                                    Sparar... <SpinnerGap size={24} className="ms-2 animate-spin" />
                                </span>
                            ) : (
                                <span className="flex">
                                    Spara ändringar <FloppyDisk size={24} className="ms-2" />
                                </span>
                            )}
                        </button>
                    </div>

                </form>
            </div>





        </div >
    )
}

export default ReviewPage