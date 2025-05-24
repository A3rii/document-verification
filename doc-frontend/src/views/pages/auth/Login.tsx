import RUPP from "./../../../assets/login/royal_univeristy_phnom_penh.png";
import RUPP_LOGO from "./../../../assets/logo/rupp_logo.png";
import LoginForm from "./../../../components/LoginForm";

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden max-w-full lg:block">
        <img
          src={RUPP}
          alt="Image"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.8] "
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img src={RUPP_LOGO} className="size-12 text-white" />
            Royal University of Phnom Penh
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
