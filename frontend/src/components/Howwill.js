"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/contexts/TranslationContext';
export default function Howwill() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <div>
      <main className="px-4 py-2 md:py-6 md:mt-2">
        <div className="max-w-full mx-auto text-center md:mt-14">
          <p className="text-2xl md:text-4xl font-normal">
            {t('KW SAUDI ARABIA')}
          </p>
          <hr className="w-48 md:w-96 mx-auto bg-[rgb(206,32,39,255)] border-0 h-[1.5px] mt-6 md:mt-16" />
          <p className="mt-4 md:mt-8 md:text-base text-sm">{t('Together We Do More')}</p>
          <p className="px-4 md:px-0 md:text-base text-sm">{t('Keller Williams Is There To Help At Every Big Step In The Realestate Journey.')}</p>
          <div className="flex justify-center md:justify-center mt-6 md:mt-10">
            <button className="
              cursor-pointer md:px-20 px-10 bg-[rgb(206,32,39,255)] text-white py-2 md:py-3 rounded-full text-sm
              relative overflow-hidden
              group transition-all duration-300
              hover:pr-20 hover:pl-16
            ">
              <span className="inline-block font-semibold text-sm transition-all duration-300" onClick={() => router.push('/contactUs')}>
                {t('JOIN US')}
              </span>
              <span className="
                absolute right-4 top-1/2 -translate-y-1/2
                opacity-0 group-hover:opacity-100
                transition-all duration-300 text-black
                group-hover:translate-x-0 translate-x-4
              ">
                ⟶
              </span>
            </button>
          </div>
        </div>
      </main>
      <div className="order-1 md:order-2 flex flex-col items-center justify-center py-2 md:py-0">
        <Image
          src="/howwillyouthink.png"
          alt={t('How Will You Thrive')}
          width={800}
          height={400}
          className="w-70 h-20 md:w-[950px] md:h-[400px] object-contain"
        />
      </div>
    </div>
  )
}
