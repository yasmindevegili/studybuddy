import { useState} from 'react'
import { useCookies} from 'react-cookie'

const Auth = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const [isLogIn, setIsLogin] = useState(true)
  const [email, setEmail]= useState(null)
  const [password, setPassword]= useState(null)
  const [confirmPassword, setConfirmPassword]= useState(null)
  const [error, setError] = useState(null)

console.log(cookies)


 const viewLogin = (status) =>{
  setError(null)
  setIsLogin(status)

 }

const handleSubmit = async(e, endpoint) =>{

  e.preventDefault()
  if (!isLogIn && password !== confirmPassword){
    setError('Senhas precisam ser identicas!')
    return
  }

  const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`,{
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({email, password})

  })

  const data = await response.json()
  
  if(data.detail){
      setError(data.detail)}
      else{
        setCookie('Email', data.email)
        setCookie('AuthToken', data.token)

        window.location.reload()
      }


  }





  return (
  <div className="auth-container">
    <div className="auth-container-box">
      <form>
        <h2> {isLogIn ? 'Please log in' : 'Please sign up!'}</h2>
        <input type= "email" 
        placeholder= "email" 
        onChange={ (e) => setEmail(e.target.value) } 
        />
        <input type= "password" 
        placeholder= "senha"
        onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogIn && <input 
        type= "password" 
        placeholder= "confirme a senha" 
        onChange={(e) => setConfirmPassword(e.target.value)}
        />}
        <input type="submit" className= "create" onClick={(e) => handleSubmit(e, isLogIn ? 'login' : 'signin')}/>
        {error && <p>{error}</p>}
      </form>
     <div className="auth-options"></div>
        <button 
        onClick={() => ((status) => {
            setError(null)
            setIsLogin(status)

          })(false)}>
          style={{backgroundColor : !isLogIn ? 'rgb (255, 255, 255)' : 'rgb(188, 1881 188)'}}
          Sign Up</button>
        <button 
        onClick={() => ((status) => {
            setError(null)
            setIsLogin(status)

          })(true)}
        style={{backgroundColor : !isLogIn ? 'rgb (255, 255, 255)' : 'rgb(188, 1881 188)'}}
        >Log In</button>
    </div>
  </div>
)
}

export default Auth;
