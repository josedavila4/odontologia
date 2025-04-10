import React from "react";
import { SvgIcon } from "@mui/material";

/**
 * Ejemplo de ícono de diente con nervios endodónticos.
 * Ajusta el path según tus gustos o bocetos reales.
 */
export default function ToothEndoIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 512 512">
      {/* Diente externo */}
      <path
        d="
          M256,32
          c-44,0-72,19-72,54
          c0,18,5,30,10,47
          c6,18-5,34-12,50
          c-8,18-16,36-16,58
          c0,14,3,25,8,34
          c5,9,11,17,13,28
          c2,11,2,24,2,37
          c0,26,11,48,30,48
          s30-22,30-48
          c0-13,0-26,2-37
          c2-11,8-19,13-28
          c5-9,8-20,8-34
          c0-22-8-40-16-58
          c-7-16-18-32-12-50
          c5-17,10-29,10-47
          c0-35-28-54-72-54Z
        "
        fill="currentColor"
      />
      
      {/* Nervios internos */}
      <path
        d="
          M256,220
          c-5,0-10,10-10,20
          c0,5,2,10,2,15
          c0,15-5,20-5,35
          c0,10,5,15,5,25
          s-5,15-5,25
          c0,10,5,15,5,25
          s-5,15-5,25
          c0,10,5,15,10,15
          s10-5,10-15
          c0-10-5-15-5-25
          s5-15,5-25
          c0-10-5-15-5-25
          s5-15,5-25
          c0-15-5-20-5-35
          c0-5,2-10,2-15
          C266,230,261,220,256,220Z
        "
        fill="rgba(0,0,0,0.15)"
      />
    </SvgIcon>
  );
}
