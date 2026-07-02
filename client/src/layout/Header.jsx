import React, {useState, useEffect} from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useSelector } from "react-redux";

const Header = () => {
  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth);

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(()=>{
   const updateDateTime = () =>{
    const now = new Date();

    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    setCurrentTime(`${hours}:${minutes} ${ampm}`);
  
    const options = { month : "short", day: "numeric", year: "numeric"};
    setCurrentDate(now.toLocaleDateString("en-IND", options));
   };

   updateDateTime();

   const intervalId = setInterval(updateDateTime, 1000);

   return () => clearInterval(intervalId);
  }, [])
  return <></>;
};

export default Header;
