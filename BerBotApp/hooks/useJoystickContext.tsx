import React, { createContext, ReactNode, useContext, useState } from "react";

type JoystickPos ={x:number, y:number};

const JoystickContext=createContext<{
    position:JoystickPos;
    setPosition:(pos:JoystickPos)=>void;
}>({
    position:{x:0,y:0},
    setPosition:()=>{},
});

type JoystickProviderProps = {
  children: ReactNode;
};

export const JoystickProvider=({children}:JoystickProviderProps)=>{
    const [position,setPosition] = useState<JoystickPos>({x:0,y:0});
    return(
        <JoystickContext.Provider value={{position,setPosition}}>
            {children}
        </JoystickContext.Provider>
    )
}
export const useJoystick=()=>useContext(JoystickContext);