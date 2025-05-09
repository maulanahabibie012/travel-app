import React from 'react';
import IMG_HERO from '../../assets/image/img_hero.jpg';
const Hero = () => {
    return (
        <>
            <section className="py-20">
                <div className="max-w-screen-xl mx-auto text-gray-600 gap-x-12 items-center justify-between overflow-hidden md:flex md:px-8">
                    <div className="flex-none space-y-5 px-4 sm:max-w-lg md:px-0 lg:max-w-xl sm:text-center md:text-left">
                        <h2 className="text-4xl text-gray-800 font-extrabold md:text-5xl">
                        Siap-siap berburu tiket murah meriah
                        </h2>
                        <p>
                        Persiapan liburan kali ini cukup bikin deg-degan, booking travel dengan harga murah di Travel Bro! dan nikmati pengalaman liburan yang tak terlupakan. Temukan penawaran terbaik untuk tiket pesawat, hotel, dan paket wisata di Travel Bro!.
                        </p>
                        
                    </div>
                    <div className="flex-none mt-14 md:mt-0 md:max-w-xl">
                        <img
                            src={IMG_HERO}
                            className=" md:rounded-tl-[108px]"
                            alt=""
                        />
                    </div>
                </div>
            </section>
        </>
    )
}

export default Hero;