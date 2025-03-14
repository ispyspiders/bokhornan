import { useState } from "react"
import StarRating from "./StarRating"
import { Plus, SpinnerGap, WarningCircle } from "@phosphor-icons/react"
import * as Yup from "yup";
import { Review } from "../types/review.types";
import { url } from "../types/auth.types";


interface FormData {
    rating: number,
    comment: string,
    book_id: string
}

interface ErrorsData {
    rating: string | null,
    comment: string | null,
    book_id: string | null
}

interface ReviewFormProps {
    bookId: string,
    onReviewCreated: (reviewData: Review) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ bookId, onReviewCreated }) => {
    const [formData, setFormData] = useState<FormData>({ rating: 0, comment: '', book_id: bookId });
    const [errors, setErrors] = useState<ErrorsData>({ rating: null, comment: null, book_id: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState<number>(0);


    
    // valideringsschema
    const validationSchema = Yup.object({
        rating: Yup.number().integer().positive().min(1, "Vänligen ange ett betyg mellan 1 och 5 stärnor").max(5, "Vänligen ange ett betyg mellan 1 och 5 stärnor").required("Vänligen ange ett betyg mellan 1 och 5 stärnor"),
        comment: Yup.string().required("Kommentar får ej vara tomt").max(255, "Kommentar får ej vara längre än 255 tecken"),
        book_id: Yup.string().required("Bok-id måste anges")
    })

    // Ta emot betyg
    const handleRatingChange = (newRating: number) => {
        setFormData({ ...formData, rating: newRating });
        setErrors({ ...errors, rating: null })
    }

    // Hantera ändring i kommentar
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newComment = e.target.value;
        setFormData({ ...formData, comment: newComment });
        //Om felmeddelande finns, ta bort om användare börjar skriva
        if (errors.comment) {
            setErrors((prevErrors) => ({ ...prevErrors, comment: null }));
        }
    }

    // Skicka formulär/skapa review
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const newReview = formData;

            // Lyckad validering, skicka data till API
            const response = await fetch(`${url}/review`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("bookToken")
                },
                body: JSON.stringify(newReview),
            });

            if (response.ok) {
                // Om ok svar, signalera skapande
                const newReview = await response.json() as Review;
                onReviewCreated(newReview);
                setFormData({ rating: 0, comment: "", book_id: bookId }); //nollställ formulär
            } else {
                const errorResponse = await response.json();
                setErrors({ ...errors, book_id: errorResponse.message || "Fel vid skapande av recension" });
            }

        } catch (validationErrors) {
            if (validationErrors instanceof Yup.ValidationError) {
            console.error("Valideringsfel: ", validationErrors);
            const errorMessages: ErrorsData = {rating:null, comment:null, book_id:null};
            validationErrors.inner.forEach((err: Yup.ValidationError)=> {
                if(err.path === "rating") errorMessages.rating = err.message;
                if(err.path === "comment") errorMessages.comment = err.message;
                if(err.path === "book_id") errorMessages.book_id = err.message;
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

    

    return (

        <form className="bg-light rounded p-4 w-full" onSubmit={handleSubmit}>
            <h3 className="mt-0 mb-4">Har du läst boken?</h3>
            <input type="hidden" name="book_id" value={bookId} id="book_id" />
            {/* Felmeddelande */}
            {errors.book_id && (
                <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                    <WarningCircle size={24} className="text-coral me-2" /> {errors.book_id}
                </div>
            )}

            <div className="flex text-dark-light text-sm items-center">
                <StarRating onRatingChange={handleRatingChange} rating={formData.rating} />
                {
                    formData.rating > 0 &&
                    <span className="ms-2">{formData.rating} / 5 </span>
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
                <button
                    type="submit"
                    className="m-0 mt-4 ps-6 pe-3 flex items-center"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex">
                            Skickar... <SpinnerGap size={24} className="ms-2 animate-spin" />
                        </span>
                    ) : (
                        <span className="flex">
                            Skicka recension <Plus size={24} className="ms-2" />
                        </span>
                    )}
                </button>
            </div>
        </form >

    )
}

export default ReviewForm