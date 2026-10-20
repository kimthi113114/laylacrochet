// Hình minh hoạ SVG cho từng mẫu túi (dùng khi chưa có ảnh thật). Chép từ bản thiết kế đầu.
export const ILLUSTRATIONS = {
                'clown-big': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <path d="M60 45 L85 0 M140 45 L115 0" stroke="#99C24D" stroke-width="5"/>
                        <rect x="45" y="40" width="110" height="125" rx="18" fill="#F4B942"/>
                        <rect x="45" y="110" width="110" height="55" rx="12" fill="#C84628"/>
                        <path d="M75 120 C75 148, 125 148, 125 120 Z" fill="#F4B942"/>
                        <path d="M65 165 L60 195 M135 165 L140 195" stroke="#C84628" stroke-width="10" stroke-linecap="round"/>
                        <circle cx="60" cy="200" r="9" fill="#F4B942"/><circle cx="140" cy="200" r="9" fill="#99C24D"/>
                        <circle cx="60" cy="60" r="18" fill="#84A955"/><circle cx="95" cy="45" r="20" fill="#F4B942"/>
                        <circle cx="130" cy="55" r="20" fill="#D93829"/><circle cx="142" cy="82" r="17" fill="#C57EDC"/>
                        <circle cx="115" cy="102" r="18" fill="#2E6F9E"/><circle cx="80" cy="102" r="18" fill="#4A89DC"/>
                        <circle cx="100" cy="76" r="28" fill="#FDF5E6"/>
                        <ellipse cx="110" cy="68" rx="6" ry="8" fill="#6C7A9C"/>
                        <circle cx="90" cy="68" r="2.5" fill="#222"/><circle cx="110" cy="68" r="2.5" fill="#222"/>
                        <circle cx="100" cy="77" r="6" fill="#D93829"/>
                        <path d="M84 87 Q100 98 116 87" stroke="#D93829" stroke-width="6" stroke-linecap="round" fill="none"/>
                        <path d="M45 45 L58 10 L82 40 Z" fill="#2E6F9E"/><circle cx="58" cy="9" r="7" fill="#F4B942"/>
                    </svg>`,
                'clown-small': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <path d="M65 55 L90 0 M135 55 L110 0" stroke="#D94E34" stroke-width="5"/>
                        <rect x="50" y="55" width="100" height="115" rx="16" fill="#F4B942"/>
                        <rect x="50" y="115" width="100" height="55" rx="12" fill="#D94E34"/>
                        <path d="M78 125 C78 150, 122 150, 122 125 Z" fill="#F4B942"/>
                        <circle cx="65" cy="70" r="16" fill="#84A955"/><circle cx="95" cy="55" r="18" fill="#F4B942"/>
                        <circle cx="125" cy="62" r="18" fill="#D93829"/><circle cx="135" cy="88" r="16" fill="#C57EDC"/>
                        <circle cx="105" cy="106" r="16" fill="#3F7CAC"/>
                        <circle cx="100" cy="82" r="25" fill="#FDF5E6"/>
                        <circle cx="90" cy="75" r="2.5" fill="#222"/><circle cx="110" cy="75" r="2.5" fill="#222"/>
                        <circle cx="100" cy="83" r="5.5" fill="#D93829"/>
                        <path d="M86 92 Q100 102 114 92" stroke="#D93829" stroke-width="5" stroke-linecap="round" fill="none"/>
                        <path d="M52 55 L68 22 L88 50 Z" fill="#3F7CAC"/><circle cx="68" cy="20" r="6" fill="#F4B942"/>
                    </svg>`,
                'clown-pair': `
                    <svg viewBox="0 0 220 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <g transform="translate(-15, 5) scale(0.85)">
                            <rect x="45" y="40" width="100" height="120" rx="16" fill="#F4B942"/>
                            <rect x="45" y="105" width="100" height="55" rx="12" fill="#C84628"/>
                            <circle cx="95" cy="76" r="32" fill="#D93829"/>
                            <circle cx="95" cy="76" r="24" fill="#FDF5E6"/>
                            <circle cx="95" cy="77" r="5" fill="#D93829"/>
                        </g>
                        <g transform="translate(65, 25) scale(0.75)">
                            <rect x="45" y="40" width="100" height="120" rx="16" fill="#F4B942"/>
                            <rect x="45" y="105" width="100" height="55" rx="12" fill="#D94E34"/>
                            <circle cx="95" cy="76" r="32" fill="#3F7CAC"/>
                            <circle cx="95" cy="76" r="24" fill="#FDF5E6"/>
                            <circle cx="95" cy="77" r="5" fill="#D93829"/>
                        </g>
                    </svg>`,
                'clown-pastel': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <rect x="48" y="45" width="104" height="125" rx="18" fill="#FDE2E4"/>
                        <rect x="48" y="112" width="104" height="58" rx="14" fill="#CDB4DB"/>
                        <circle cx="65" cy="65" r="18" fill="#A2D2FF"/><circle cx="100" cy="50" r="20" fill="#FFAFCC"/>
                        <circle cx="132" cy="68" r="18" fill="#CDB4DB"/><circle cx="100" cy="105" r="18" fill="#BDE0FE"/>
                        <circle cx="100" cy="80" r="26" fill="#FFFDF9"/>
                        <circle cx="90" cy="74" r="2.5" fill="#444"/><circle cx="110" cy="74" r="2.5" fill="#444"/>
                        <circle cx="100" cy="81" r="5.5" fill="#FF8FA3"/>
                        <path d="M86 90 Q100 99 114 90" stroke="#FF8FA3" stroke-width="5" stroke-linecap="round" fill="none"/>
                    </svg>`,
                'floral-daisy': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <path d="M65 45 L95 0 M135 45 L105 0" stroke="#D4A373" stroke-width="5"/>
                        <rect x="48" y="45" width="104" height="135" rx="20" fill="#FAEDCD" stroke="#D4A373" stroke-width="3"/>
                        <circle cx="100" cy="112" r="26" fill="#FFFFFF"/>
                        <circle cx="100" cy="88" r="12" fill="#FFFFFF"/><circle cx="100" cy="136" r="12" fill="#FFFFFF"/>
                        <circle cx="76" cy="112" r="12" fill="#FFFFFF"/><circle cx="124" cy="112" r="12" fill="#FFFFFF"/>
                        <circle cx="100" cy="112" r="12" fill="#F4B942"/>
                    </svg>`,
                'floral-tulip': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <rect x="48" y="45" width="104" height="135" rx="20" fill="#FDF8EE" stroke="#E86F2C" stroke-width="2"/>
                        <path d="M100 145 V105 M85 135 Q100 125 100 145 M115 135 Q100 125 100 145" stroke="#84A955" stroke-width="6" stroke-linecap="round"/>
                        <path d="M82 95 C82 70, 118 70, 118 95 C118 110, 82 110, 82 95 Z" fill="#FF758F"/>
                    </svg>`,
                'cute-bear': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <circle cx="62" cy="52" r="18" fill="#B07D52"/><circle cx="138" cy="52" r="18" fill="#B07D52"/>
                        <rect x="48" y="48" width="104" height="130" rx="26" fill="#C68B59"/>
                        <ellipse cx="100" cy="100" rx="20" ry="15" fill="#F5EBE0"/>
                        <circle cx="82" cy="82" r="4" fill="#2A221E"/><circle cx="118" cy="82" r="4" fill="#2A221E"/>
                        <circle cx="100" cy="96" r="5" fill="#2A221E"/>
                        <rect x="68" y="130" width="64" height="32" rx="12" fill="#F4B942"/>
                    </svg>`,
                'cute-frog': `
                    <svg viewBox="0 0 200 220" class="w-28 h-32 sm:w-36 sm:h-40 mx-auto drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                        <circle cx="70" cy="48" r="20" fill="#84A955"/><circle cx="130" cy="48" r="20" fill="#84A955"/>
                        <circle cx="70" cy="46" r="10" fill="#FFF"/><circle cx="130" cy="46" r="10" fill="#FFF"/>
                        <circle cx="70" cy="46" r="5" fill="#222"/><circle cx="130" cy="46" r="5" fill="#222"/>
                        <rect x="48" y="52" width="104" height="125" rx="24" fill="#84A955"/>
                        <ellipse cx="72" cy="88" rx="9" ry="5" fill="#FF99AC"/>
                        <ellipse cx="128" cy="88" rx="9" ry="5" fill="#FF99AC"/>
                        <path d="M82 88 Q100 100 118 88" stroke="#2A221E" stroke-width="4" stroke-linecap="round" fill="none"/>
                    </svg>`
};

// Nền dark + SVG lớn của khối hero (2 túi chú hề)
export const HERO_ART = `
                                    <!-- Tropical Leaf Background Hint -->
                                    <svg class="absolute -left-8 bottom-0 w-40 h-56 text-green-900/40 pointer-events-none" viewBox="0 0 200 300" fill="currentColor">
                                        <path d="M20,300 C40,200 120,120 180,20 C140,140 80,220 20,300 Z" />
                                        <path d="M0,260 C30,170 90,100 140,10 C100,120 50,190 0,260 Z" />
                                    </svg>

                                    <svg class="w-full h-full max-h-[360px] sm:max-h-[420px] drop-shadow-2xl animate-float" viewBox="0 0 420 480" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <!-- Straps Going Up -->
                                        <path d="M125 135 L165 0" stroke="#A3C644" stroke-width="10" stroke-linecap="round"/>
                                        <path d="M225 135 L175 0" stroke="#F4B942" stroke-width="8" stroke-linecap="round" stroke-dasharray="6 4"/>
                                        <path d="M235 160 L290 0" stroke="#D94E34" stroke-width="7" stroke-linecap="round"/>
                                        <path d="M315 165 L325 0" stroke="#F4B942" stroke-width="6" stroke-linecap="round"/>

                                        <!-- MINI CLOWN BAG (RIGHT) -->
                                        <g transform="translate(215, 115) rotate(-3)">
                                            <rect x="20" y="55" width="110" height="80" rx="14" fill="#F4B942"/>
                                            <rect x="20" y="115" width="110" height="65" rx="10" fill="#D94E34"/>
                                            <path d="M25 130 H125 M25 145 H125 M25 160 H125" stroke="#B53820" stroke-width="2" stroke-dasharray="5 5"/>
                                            <path d="M35 100 L55 125 M115 100 L95 125" stroke="#B53820" stroke-width="4" stroke-linecap="round"/>
                                            <circle cx="55" cy="122" r="6" fill="#6E4726" stroke="#F4B942" stroke-width="1.5"/>
                                            <circle cx="95" cy="122" r="6" fill="#6E4726" stroke="#F4B942" stroke-width="1.5"/>
                                            <path d="M52 135 C52 162, 98 162, 98 135 Z" fill="#F4B942" stroke="#D98A2B" stroke-width="2"/>
                                            
                                            <circle cx="32" cy="70" r="18" fill="#84A955"/>
                                            <circle cx="30" cy="92" r="16" fill="#F9C770"/>
                                            <circle cx="52" cy="50" r="18" fill="#F4B942"/>
                                            <circle cx="80" cy="48" r="20" fill="#D93829"/>
                                            <circle cx="108" cy="65" r="18" fill="#C57EDC"/>
                                            <circle cx="112" cy="90" r="16" fill="#C57EDC"/>
                                            <circle cx="95" cy="108" r="16" fill="#3F7CAC"/>
                                            <circle cx="70" cy="112" r="16" fill="#5B9BD5"/>
                                            <circle cx="46" cy="106" r="15" fill="#F9C770"/>

                                            <circle cx="74" cy="80" r="28" fill="#FDF5E6"/>
                                            <ellipse cx="83" cy="73" rx="6" ry="8" fill="#6C7A9C"/>
                                            <circle cx="64" cy="73" r="2.5" fill="#2A221E"/>
                                            <circle cx="83" cy="73" r="2.5" fill="#2A221E"/>
                                            <circle cx="74" cy="82" r="6" fill="#D93829"/>
                                            <path d="M57 90 Q74 103 91 90 Q74 96 57 90 Z" fill="#D93829" stroke="#D93829" stroke-width="5" stroke-linejoin="round"/>
                                            <path d="M62 92 H86" stroke="#FFF" stroke-width="3" stroke-dasharray="3 3" stroke-linecap="round"/>

                                            <path d="M22 45 L45 12 L62 42 Z" fill="#3F7CAC"/>
                                            <circle cx="45" cy="10" r="8" fill="#F4B942"/>
                                        </g>

                                        <!-- LARGE CLOWN BAG WITH LEGS (LEFT) -->
                                        <g transform="translate(55, 85)">
                                            <path d="M25 160 L-5 170" stroke="#F4B942" stroke-width="16" stroke-linecap="round"/>
                                            <circle cx="-12" cy="172" r="9" fill="#FFFDF9"/>
                                            <path d="M165 160 L195 172" stroke="#F4B942" stroke-width="16" stroke-linecap="round"/>
                                            <circle cx="202" cy="175" r="9" fill="#FFFDF9"/>

                                            <rect x="25" y="45" width="140" height="120" rx="22" fill="#99C24D"/>
                                            <rect x="25" y="145" width="140" height="65" fill="#F4B942"/>
                                            <rect x="25" y="195" width="140" height="90" rx="16" fill="#C84628"/>
                                            <path d="M32 210 H158 M32 225 H158 M32 240 H158 M32 255 H158 M32 270 H158" stroke="#A3331A" stroke-width="2.5" stroke-dasharray="6 6"/>

                                            <path d="M35 150 L68 195 M155 150 L122 195" stroke="#B53820" stroke-width="5" stroke-linecap="round"/>
                                            <circle cx="68" cy="192" r="8" fill="#5C3A1E" stroke="#F4B942" stroke-width="2"/>
                                            <circle cx="122" cy="192" r="8" fill="#5C3A1E" stroke="#F4B942" stroke-width="2"/>

                                            <path d="M65 208 C65 248, 125 248, 125 208 Z" fill="#F4B942" stroke="#D98A2B" stroke-width="2.5"/>

                                            <path d="M52 282 L46 320" stroke="#C84628" stroke-width="12" stroke-linecap="round"/>
                                            <ellipse cx="45" cy="318" rx="13" ry="6" fill="#FFFFFF"/>
                                            <circle cx="44" cy="328" r="11" fill="#F4B942"/>
                                            <circle cx="38" cy="330" r="4" fill="#D93829"/>
                                            <path d="M138 282 L144 335" stroke="#C84628" stroke-width="12" stroke-linecap="round"/>
                                            <ellipse cx="144" cy="332" rx="13" ry="6" fill="#FFFFFF"/>
                                            <circle cx="145" cy="344" r="11" fill="#99C24D"/>
                                            <circle cx="141" cy="346" r="4" fill="#D93829"/>

                                            <circle cx="40" cy="75" r="24" fill="#84A955"/>
                                            <circle cx="35" cy="108" r="22" fill="#F9C770"/>
                                            <circle cx="72" cy="52" r="25" fill="#F4B942"/>
                                            <circle cx="115" cy="55" r="26" fill="#D93829"/>
                                            <circle cx="148" cy="85" r="24" fill="#C57EDC"/>
                                            <circle cx="148" cy="118" r="22" fill="#C57EDC"/>
                                            <circle cx="122" cy="142" r="23" fill="#2E6F9E"/>
                                            <circle cx="88" cy="146" r="23" fill="#4A89DC"/>
                                            <circle cx="55" cy="136" r="20" fill="#7FB3D5"/>

                                            <circle cx="95" cy="100" r="38" fill="#FDF5E6"/>
                                            <ellipse cx="108" cy="88" rx="9" ry="12" transform="rotate(-15 108 88)" fill="#6C7A9C"/>
                                            <circle cx="82" cy="88" r="3.5" fill="#2A221E"/>
                                            <circle cx="108" cy="88" r="3.5" fill="#2A221E"/>
                                            <circle cx="95" cy="100" r="8.5" fill="#D93829"/>
                                            <path d="M72 114 Q95 132 118 114 Q95 122 72 114 Z" fill="#D93829" stroke="#D93829" stroke-width="7" stroke-linejoin="round"/>
                                            <path d="M78 117 H112" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="4 4" stroke-linecap="round"/>

                                            <path d="M22 58 L35 5 L68 48 Z" fill="#2E6F9E"/>
                                            <circle cx="34" cy="4" r="10" fill="#F4B942"/>
                                        </g>
                                    </svg>

`;

export const ILLUSTRATION_KEYS = Object.keys(ILLUSTRATIONS);

/** Gợi ý hình minh hoạ theo lựa chọn (tạm dùng cho tới khi có ảnh thật). */
export function illustrationFor(key, variantLabel = '') {
  if (key === 'clown-big' || key === 'clown-small' || key === 'clown-pastel') {
    if (/pastel/i.test(variantLabel)) return 'clown-pastel';
    if (/mini/i.test(variantLabel)) return 'clown-small';
    if (/full/i.test(variantLabel)) return 'clown-big';
  }
  return key;
}
