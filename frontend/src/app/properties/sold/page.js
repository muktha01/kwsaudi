'use client'
import React, { Suspense } from 'react';
import Header from '@/components/header';
import Box from '@/components/box';
import Footer from '@/components/footer';
import PropertyType from '@/components/propertype'


const Rent = () => {
    return (
        <div>
          <Header />
      <Box h3={"Sold Listings"} src="/bgrent.jpg" image="/properties2.jpg" />
    
   <Suspense fallback={<div>Loading...</div>}>
     <PropertyType type='Sold'></PropertyType>
   </Suspense>
      <Footer></Footer>
        </div>
    );
}

export default Rent;
