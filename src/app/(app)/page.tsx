'use client'
import React from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import AutoPlay from "embla-carousel-autoplay"
import messages from "@/messages.json"
import { FaGithubAlt, FaLinkedin } from "react-icons/fa";
import { FaWebAwesome } from "react-icons/fa6";


const Home = () => {
  return (
    <>
    <main className='flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Divie into the world of honest Feedbacks</h1>
        <p className='m-3 md:text-2xl text-xl '>Share your true questions and opininons</p>
      </section>
      <Carousel
        plugins={[AutoPlay({ delay: 2000 })]}
        className="w-full max-w-xs">
        <CarouselContent>
          {
            messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-lg font-semibold">{message.content}</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
    <footer className='text-center p-4 md:p-6 bg-black text-white'>
    &#169; 2024 created by Sankalp: 
    <a href="https://github.com/sankalpbarriar" target='_blank' rel='noopener noreferrer' className='ml-2'>
      <FaGithubAlt className='inline-block hover:text-yellow-400 delay-200' />
    </a> 
    | 
    <a href="https://www.linkedin.com/in/sankalp-barriar-211793199?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B4EP8Gut4SjWSxR4X2OAVcQ%3D%3D" target='_blank' rel='noopener noreferrer' className='ml-2'>
      <FaLinkedin className='inline-block hover:text-yellow-400 delay-200' />
    </a> 
    | 
    <a href="https://kalp-barriar.netlify.app/" target='_blank' rel='noopener noreferrer' className='ml-2'>
      <FaWebAwesome className='inline-block hover:text-yellow-400 delay-200' />
    </a>
  </footer>
    </>
  )

}

export default Home