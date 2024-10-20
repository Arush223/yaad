import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <div style={styles}>
    <Navbar />
    <SignUp path="/auth/sign-up" routing="path" signInUrl="/auth/sign-in" />
    <Footer />
  </div>
);

export default SignUpPage;

const styles = {
  width: "100vw",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};
