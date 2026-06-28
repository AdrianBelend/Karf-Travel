import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function BrandLogo({ className = '', size = 'md', showText = true }: BrandLogoProps) {
  // Ajustes de tamaño para el contenedor SVG
  const dimensions = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-36 w-36',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Contenedor SVG de alta fideliad del logo original "Karf Travels" */}
      <svg
        viewBox="0 0 500 400"
        className={`${dimensions[size]} select-none shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fondo del sol poniente (Círculo naranja vibrante) */}
        <circle cx="250" cy="180" r="150" fill="#f29815" />
        
        {/* Nubes sutiles de fondo (Líneas blancas que recortan el sol) */}
        <path d="M120 120 H 260 M280 100 H 360 M100 160 H 180" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.4" />
        
        {/* Aves en vuelo (Lado izquierdo) */}
        <path d="M 180 60 Q 190 55 195 65 Q 200 55 210 60 Q 195 72 180 60 Z" fill="#111827" />
        <path d="M 220 90 Q 228 86 232 94 Q 236 86 244 90 Q 232 100 220 90 Z" fill="#111827" />
        <path d="M 155 105 Q 161 102 164 108 Q 167 102 173 105 Q 164 112 155 105 Z" fill="#111827" />
        <path d="M 255 110 Q 260 107 263 113 Q 266 107 271 110 Q 263 117 255 110 Z" fill="#111827" />

        {/* Palmeras en el lado derecho */}
        {/* Palmera 1 (Grande) */}
        <path d="M 320 280 Q 300 210 330 140 Q 325 140 315 280 Z" fill="#111827" />
        {/* Hojas Palmera 1 */}
        <path d="M 330 140 Q 360 110 395 125 Q 360 135 330 140" fill="#111827" />
        <path d="M 330 140 Q 365 140 380 170 Q 355 155 330 140" fill="#111827" />
        <path d="M 330 140 Q 300 110 270 125 Q 300 135 330 140" fill="#111827" />
        <path d="M 330 140 Q 295 140 280 170 Q 305 155 330 140" fill="#111827" />
        <path d="M 330 140 Q 330 100 340 85 Q 335 110 330 140" fill="#111827" />

        {/* Palmera 2 (Pequeña, más al fondo a la derecha) */}
        <path d="M 370 280 Q 355 220 375 165" stroke="#111827" strokeWidth="6" strokeLinecap="round" />
        {/* Hojas Palmera 2 */}
        <path d="M 375 165 Q 395 145 420 155 Q 395 162 375 165" fill="#111827" />
        <path d="M 375 165 Q 355 145 330 155 Q 355 162 375 165" fill="#111827" />
        <path d="M 375 165 Q 385 185 395 200 Q 380 180 375 165" fill="#111827" />
        <path d="M 375 165 Q 365 185 355 200 Q 370 180 375 165" fill="#111827" />

        {/* Suelo horizontal oscuro / Sombra del vehículo */}
        <ellipse cx="250" cy="295" rx="190" ry="12" fill="#111827" />

        {/* El Vehículo (Van ejecutiva blanca con contorno negro) */}
        {/* Contorno/Sombra de la Van entera */}
        <path 
          d="M 125 240 Q 120 160 190 155 Q 230 150 290 175 Q 350 205 375 240 Q 380 250 375 265 H 125 Z" 
          fill="#111827" 
        />
        {/* Cuerpo Blanco de la Van */}
        <path 
          d="M 128 240 Q 123 164 190 159 Q 228 154 286 178 Q 345 207 370 240 Q 374 246 370 261 H 130 Z" 
          fill="#ffffff" 
        />

        {/* Ventana/Parabrisas Delantero (Negro/Gris) */}
        <path d="M 305 200 Q 320 207 335 220 Q 338 225 332 235 L 295 235 L 295 200 Z" fill="#111827" />
        {/* Ventana Lateral Delantera (Piloto) */}
        <path d="M 252 195 H 287 V 235 H 252 Z" fill="#111827" />
        {/* Ventana Lateral Grande de Pasajeros */}
        <path d="M 140 195 H 242 V 230 H 140 Z" fill="#111827" />

        {/* Detalles de Carrocería (Líneas negras) */}
        {/* Línea lateral de impacto */}
        <path d="M 132 245 H 280 L 295 250 H 368 " stroke="#111827" strokeWidth="3" strokeLinecap="round" />
        {/* Guardabarros delantero y trasero */}
        <path d="M 145 261 A 18 18 0 0 1 181 261" stroke="#111827" strokeWidth="5" fill="none" />
        <path d="M 295 261 A 18 18 0 0 1 331 261" stroke="#111827" strokeWidth="5" fill="none" />

        {/* Las Ruedas / Neumáticos */}
        {/* Neumático Trasero */}
        <circle cx="163" cy="265" r="16" fill="#111827" />
        <circle cx="163" cy="265" r="7" fill="#ffffff" />
        {/* Neumático Delantero */}
        <circle cx="313" cy="265" r="16" fill="#111827" />
        <circle cx="313" cy="265" r="7" fill="#ffffff" />

        {/* Focos / Luces */}
        <path d="M 360 236 L 368 239 V 244 H 360 Z" fill="#f29815" />
      </svg>

      {/* Nombre de la Empresa con Tipografía elegante */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-black tracking-tight leading-none text-gray-950 font-display uppercase">
            KARF <span className="text-[#f29815]">TRAVELS</span>
          </span>
          <span className="text-[10px] uppercase font-semibold font-sans tracking-widest text-gray-400 mt-1 leading-none">
            Transporte Grupal & Chofer
          </span>
        </div>
      )}
    </div>
  );
}
