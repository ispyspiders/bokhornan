import { FloppyDisk, LineVertical, SpinnerGap, Trash, UserCircle, WarningCircle } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { url } from '../types/auth.types'
import * as Yup from "yup";


interface FormData {
    name: string,
    current_read: string,
    bio: string,
    avatar: File | null
}
interface ErrorsData {
    name: string,
    current_read: string,
    bio: string,
    avatar: string,
    main: string
}

const EditProfilePage = () => {
    const { user, updateUser } = useAuth(); //inloggad användare
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        name: user?.name || "",
        current_read: user?.current_read || "",
        bio: user?.bio || "",
        avatar: null
    });
    const [errors, setErrors] = useState<ErrorsData>({
        name: "",
        current_read: "",
        bio: "",
        avatar: "",
        main: ""
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showFileInput, setShowFileInput] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar_url || null);

    // valideringsschema
    const validationSchema = Yup.object({
        name: Yup.string().required("Namn får ej vara tomt").max(255, "Namn får ej vara längre än 255 tecken"),
        current_read: Yup.string().max(255, "Läser just nu får ej vara längre än 255 tecken"),
        bio: Yup.string().max(255, "Biografi får ej vara längre än 255 tecken")
    })

    // Hantera filuppladdning
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            const maxSize = 2 * 1024 * 1024; // 2MB
            if (file.size > maxSize) {
                setErrors({ ...errors, avatar: "Filstorleken får inte överstiga 2MB" });
                return;
            }

            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                setErrors({ ...errors, avatar: "Endast JPEG, JPG, PNG eller GIF tillåts" });
                return;
            }

            setErrors({ ...errors, avatar: '' }); // nollställ tidigare felmeddelanden

            setFormData({ ...formData, avatar: file });
            const fileReader = new FileReader();
            fileReader.onloadend = () => {
                setAvatarPreview(fileReader.result as string);
            };
            fileReader.readAsDataURL(file);
        }
    };

    // Radera profilbild
    const handleDeleteAvatar = async () => {
        setIsDeleting(true);
        setErrors({
            name: "",
            current_read: "",
            bio: "",
            avatar: "",
            main: ""
        })
        try {
            const response = await fetch(`${url}/user/${user?.id}/deleteavatar`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("bookToken")
                },
            });

            if (!response.ok) throw new Error("Något gick fel vid radering av profilbild");

            setAvatarPreview(null);
            setErrors({
                name: "",
                current_read: "",
                bio: "",
                avatar: "",
                main: ""
            });
            if (user) {
                updateUser({ ...user, avatar_url: null })
            }
            setShowConfirmDelete(false);
        } catch (error) {
            console.error("Fel vid radering av profilbild: ", error);
            setErrors({ ...errors, main: "Något gick fel vid radering av profilbild" })
        } finally {
            setIsDeleting(false);
        }
    };

    // Hantera formulärets inskick för att uppdatera profilinfo
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('bio', formData.bio);
        formDataToSend.append('current_read', formData.current_read);

        // Om avatar vald
        if (formData.avatar) {
            formDataToSend.append('avatar', formData.avatar);
        }

        try {
            await validationSchema.validate(formData, { abortEarly: false });

            const response = await fetch(`${url}/user/${user?.id}?_method=PUT`, {
                method: 'POST',
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("bookToken")
                },
                body: formDataToSend,
            });

            if (!response.ok) throw new Error('Något gick fel vid uppdateringen');

            const updatedAvatarUrl = avatarPreview || user?.avatar_url || '';

            if (user) {
                updateUser({
                    ...user,
                    name: formData.name,
                    current_read: formData.current_read,
                    bio: formData.bio,
                    avatar_url: updatedAvatarUrl
                });
            }
            navigate(`/profile/${user?.id}`);
        } catch (validationErrors) {
            if (validationErrors instanceof Yup.ValidationError) {
                console.error("Valideringsfel: ", validationErrors);
                const errorMessages: ErrorsData = { name: '', bio: '', current_read: '', avatar: '', main: '' };
                validationErrors.inner.forEach((err: Yup.ValidationError) => {
                    if (err.path === "name") errorMessages.name = err.message;
                    if (err.path === "bio") errorMessages.bio = err.message;
                    if (err.path === "current_read") errorMessages.current_read = err.message;
                });
                setErrors(errorMessages);
            } else {
                setErrors({ ...errors, main: 'Det gick inte att uppdatera din profil.' });
                console.error('Fel vid uppdatering:', validationErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || '',
                current_read: user.current_read || '',
                avatar: null
            });
            setAvatarPreview(user.avatar_url || null)
        }
    }, [user])


    return (
        <div className='p-4 py-12 md:p-12'>
            <h2>Redigera profil</h2>
            <div className='bg-light rounded-lg p-4 my-4 mx-auto drop-shadow-sm flex flex-wrap gap-2'>
                {/* felmeddelande */}
                {errors.main &&
                    <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                        <WarningCircle size={24} className="text-coral me-2" /> {errors.main}
                    </div>
                }

                <form onSubmit={handleSave} className='w-full sm:grid grid-cols-2 gap-4 md:gap-8 lg:gap-16'>
                    <div>
                        {/* namn */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm mb-2 font-light" htmlFor="email">Namn</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="text-md p-2 rounded border border-blush-mid drop-shadow-sm focus:bg-blush-light focus:bg-opacity-50"
                            />
                            {
                                errors.name && <span className="text-sm font-light mt-2 ms-2 text-red-500">{errors.name}</span>
                            }
                        </div>

                        {/* current read */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm mb-2 font-light" htmlFor="email">Läser just nu</label>
                            <input
                                type="text"
                                id="currentRead"
                                value={formData.current_read}
                                onChange={(e) => setFormData({ ...formData, current_read: e.target.value })}
                                className="text-md p-2 rounded border border-blush-mid drop-shadow-sm focus:bg-blush-light focus:bg-opacity-50"
                            />
                            {
                                errors.name && <span className="text-sm font-light mt-2 ms-2 text-red-500">{errors.name}</span>
                            }
                        </div>

                        {/* bio */}
                        <div className="flex flex-col mb-4">
                            <label className="text-sm mb-2 font-light" htmlFor="email">Biografi</label>
                            <textarea
                                name="bio"
                                id="bio"
                                rows={6}
                                className="w-full py-2 px-4 rounded border border-blush-mid focus:outline-coral focus:bg-blush-light"
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                value={formData.bio}
                            ></textarea>
                            {
                                errors.bio && <span className="text-sm font-light mt-2 ms-2 text-red-500">{errors.bio}</span>
                            }
                        </div>
                    </div>
                    {/* Profilbild */}
                    <div className='mb-4 flex flex-col w-fit'>
                        <span className="text-sm mb-2 font-light">Profilbild</span>
                        {avatarPreview && !formData.avatar ? (
                            <div>
                                <img src={avatarPreview} alt="Avatar" className='w-56 h-56 object-cover' />

                                <div className='flex items-center justify-end'>
                                    {/* Radera knapp */}
                                    <button type='button' onClick={() => setShowConfirmDelete(true)} className='m-0 p-0 mt-2 bg-transparent text-sm font-montserrat font-semibold text-red-800 hover:underline hover:bg-transparent'>
                                        Radera bild
                                    </button>

                                    {/* uppdatera knapp */}
                                    {!formData.avatar &&
                                        <>
                                            <LineVertical size={24} className='text-blush-deep mt-2' />
                                            <button type='button' onClick={() => setShowFileInput(!showFileInput)} className='m-0 p-0 mt-2 bg-transparent text-sm font-montserrat font-semibold text-dark-soft hover:underline hover:bg-transparent'>
                                                {showFileInput ? 'Avbryt' : 'Ändra bild'}
                                            </button>
                                        </>
                                    }
                                </div>

                            </div>
                        ) : (
                            <div className='flex flex-col items-end'>
                                <div className='bg-blush-light rounded flex justify-center items-center w-56 h-56'>
                                    <UserCircle size={200} weight='duotone' className='text-blush-deep' />
                                </div>
                                <button type='button' onClick={() => setShowFileInput(!showFileInput)}
                                    className='m-0 p-0 mt-2 bg-transparent text-sm font-montserrat font-semibold text-dark-soft hover:underline hover:bg-transparent'>
                                    {showFileInput ? 'Avbryt uppladdning' : 'Uppdatera profilbild'}
                                </button>

                                {showFileInput && (
                                    <div className='mt-4 p-2 bg-white rounded border border-blush-mid w-full max-w-56'>
                                        <input type="file" name="avatar" id="avatar" accept='image/*' onChange={handleAvatarChange} className='' />
                                    </div>
                                )}
                            </div>
                        )}
                        {
                            errors.avatar && <span className="text-sm font-light mt-2 ms-2 text-red-500">{errors.avatar}</span>
                        }

                        {/* Bekräfta radering modal */}
                        {showConfirmDelete && (
                            <div className='bg-dark-soft rounded-lg bg-opacity-80 z-10 fixed inset-0 flex items-center justify-center'>
                                <div className="bg-white rounded-lg m-2 mt-4 h-fit border-4 border-coral">
                                    <div className='mb-4 bg-coral bg-opacity-10 rounded-t py-2 flex items-center'>
                                        <WarningCircle size={24} className='text-coral ms-4' />
                                        <h3 className='font-montserrat font-bold text-lg m-0 ms-2'>Radera profilbild</h3>
                                    </div>
                                    <p className="mx-4 font-montserrat">Är du säker på att du vill ta bort din profilbild?</p>
                                    <p className="mx-4 font-montserrat">Denna åtgärd går inte att ångra.</p>
                                    <div className="flex justify-end gap-4 mt-4 p-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmDelete(false)}
                                            className="bg-blush-mid text-sm m-0 px-4 hover:bg-opacity-80"
                                        >
                                            Avbryt
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteAvatar}
                                            className="bg-coral text-white text-sm m-0 hover:bg-coral hover:bg-opacity-80"
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? (
                                                <span className="flex">
                                                    Raderar... <SpinnerGap size={20} className="ms-2 animate-spin" />
                                                </span>
                                            ) : (
                                                <span className="flex">
                                                    Radera <Trash size={20} className="ms-2" />
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                    <div className="w-full flex justify-end col-span-2">
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
        </div>
    )
}

export default EditProfilePage