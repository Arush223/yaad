import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <div style={styles}>
    <Navbar />
    <SignIn path="/auth/sign-in" routing="path" signUpUrl="/auth/sign-up" />
    <Footer />
  </div>
);

export default SignInPage;

const styles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
