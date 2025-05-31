import { Separator } from "./../../../components/ui/separator";
import { useNavigate } from "react-router";
import { Button } from "./../../../components/ui/button";
import Illustrate from "./../../../assets/illustration/illustrate.png";
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-container mx-auto min-h-[50vh] flex items-center px-4   m-22">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-12">
        {/* Text Content */}
        <div className="flex flex-col items-start gap-6 flex-1">
          <div className="space-y-2">
            <h1 className="font-sora text-custom-primary text-4xl font-[800] md:text-5xl lg:text-6xl tracking-widest">
              Certificate
            </h1>
            <h1 className="font-sora text-4xl font-[800] md:text-5xl lg:text-6xl text-gray-900 tracking-widest">
              Verification
            </h1>
          </div>

          <Separator className="w-24 h-1 bg-custom-primary" />

          <p className="font-sora text-lg md:text-xl lg:text-2xl text-gray-600 tracking-widest">
            Blockchain verification platform
          </p>

          {/* Optional CTA button */}
          <Button
            onClick={() => navigate("/verify")}
            className="mt-4 px-6 py-4 bg-custom-primary text-white font-sora font-semibold rounded-lg hover:bg-custom-primary-dark transition duration-300 cursor-pointer">
            Get Started
          </Button>
        </div>

        {/* Illustration */}
        <div className="flex-1 flex justify-end items-end ">
          <img
            src={Illustrate}
            alt="Certificate verification illustration"
            className="w-72 h-72 md:w-80 md:h-80 lg:w-104 lg:h-104 object-cover max-w-full"
          />
        </div>
      </div>
    </div>
  );
}
