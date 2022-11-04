import  {Outlet} from "@remix-run/react";




export default function Games() {


  // @ts-ignore
  return (
    <div className="px-3 flex flex-col gap-5">
     <Outlet></Outlet>
    </div>
  );

}