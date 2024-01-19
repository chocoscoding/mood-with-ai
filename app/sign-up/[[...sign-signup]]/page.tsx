import { SignUp } from '@clerk/nextjs';

const SignupPage = () => {
  return (
    <SignUp afterSignUpUrl={`/new-user`} redirectUrl={`/new-user`}/>
  )
}

export default SignupPage