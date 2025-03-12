import { SignIn, SpinnerGap, WarningCircle } from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // kontrollera användare
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate("/profile");
    } catch (error) {
      setError("Inloggning misslyckades! Kontrollera epost/lösenord.")
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="bg-blob bg-cover">
      <div className="p-4">
        <div className="bg-light rounded-lg p-4 my-12 mx-auto max-w-80 drop-shadow-sm">
          <h1 className="text-3xl text-center text-dark-soft font-display my-4 mb-9">Logga in</h1>
          <form onSubmit={handleSubmit}>

            {/* Felmeddelande */}
            {error && (
              <div className="bg-coral bg-opacity-10 border-2 border-coral rounded-md p-2 my-4 flex items-center text-sm">
                <WarningCircle size={24} className="text-coral me-2" /> {error}
              </div>
            )}

            <div className="flex flex-col mb-4">
              <label className="text-sm mb-2 font-light" htmlFor="email">Epost</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-md p-2 rounded border border-blush-mid drop-shadow-sm focus:bg-blush-light focus:bg-opacity-50"
              />
            </div>

            <div className="flex flex-col mb-4">
              <label className="text-sm font-light mb-2" htmlFor="password">Lösenord</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-md p-2 rounded border border-blush-mid drop-shadow-sm focus:bg-blush-light focus:bg-opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blush-deep ps-8 pe-4 py-2 rounded-lg flex mx-auto my-8 drop-shadow-sm hover:bg-blush-mid"
            >
              {isSubmitting ?
                <>
                  <span className="me-2">Loggar in</span> <SpinnerGap size={24} className="animate-spin" />
                </>
                :
                <>
                  <span className="me-2">Logga in</span> <SignIn size={24} />
                </>
              }
            </button>
          </form>
          <div>
          </div>
          <p className="text-center text-sm font-montserrat">Inte medlem? 
            <Link to="/register" className="ms-2 font-medium text-dark-soft hover:underline">Bli medlem!</Link>
            </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage