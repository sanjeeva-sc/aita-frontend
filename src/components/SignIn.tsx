import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">AiTA</h1>
          <p className="text-gray-600">AI Teaching Assistant</p>
        </div>

        {/* Clerk SignIn Component */}
        <div className="flex justify-center">
          <ClerkSignIn 
            routing="path" 
            path="/sign-in" 
            signUpUrl="/sign-up"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-lg border-0",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;