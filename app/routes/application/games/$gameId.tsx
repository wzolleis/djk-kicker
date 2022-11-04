import  {Outlet} from "@remix-run/react";




export default function Games() {


  // @ts-ignore
  return (
    <div className="flex flex-col gap-5">
     <Outlet></Outlet>
    </div>
  );

}