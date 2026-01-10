"use client"

import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// 1. The Data Array
const testimonials = [
  { id: 1, name: "ESTELLA NG", role: "Artist and Co-Founder, Ripple Root", quote: "I think so much about living is about finding out the solutions that are best for yourself.", img: "https://i.pravatar.cc/150?u=1" },
  { id: 2, name: "MARCUS TAN", role: "Co-Founder, Carousell", quote: "Innovation comes from solving your own problems and realizing others have them too.", img: "https://i.pravatar.cc/150?u=2" },
  { id: 3, name: "SARAH CHEN", role: "Creative Director, Bloom", quote: "Design is not just what it looks like, it is how it functions for the end user.", img: "https://i.pravatar.cc/150?u=3" },
  { id: 4, name: "JASON LEE", role: "Tech Lead, Nexus", quote: "The best code is the code that is easy to delete and even easier to maintain.", img: "https://i.pravatar.cc/150?u=4" },
  { id: 5, name: "AMANDA LOW", role: "Founder, GreenSpace", quote: "Sustainability isn't a feature; it's a fundamental requirement for modern business.", img: "https://i.pravatar.cc/150?u=5" },
  { id: 6, name: "DERRICK GOH", role: "VP, Fintech Solutions", quote: "Trust is the hardest currency to earn and the easiest to lose in the digital age.", img: "https://i.pravatar.cc/150?u=6" },
  { id: 7, name: "ELENA RODRIGUEZ", role: "Lead Designer, Archi", quote: "Spaces should tell a story about the people who inhabit them every single day.", img: "https://i.pravatar.cc/150?u=7" },
  { id: 8, name: "KEVIN WONG", role: "Strategy Head, Spark", quote: "Growth is never by mere chance; it is the result of forces working together.", img: "https://i.pravatar.cc/150?u=8" },
  { id: 9, name: "PRIYA DASH", role: "Product Manager, Flow", quote: "Focus on the problem, not the solution, and the right product will follow.", img: "https://i.pravatar.cc/150?u=9" },
  { id: 10, name: "LIAM NEESON", role: "Operations, Global Log", quote: "Efficiency is doing things right; effectiveness is doing the right things.", img: "https://i.pravatar.cc/150?u=10" },
  { id: 11, name: "CHLOE TAY", role: "Marketing, Social Hive", quote: "Content is fire; social media is gasoline. You need both to start a movement.", img: "https://i.pravatar.cc/150?u=11" },
  { id: 12, name: "RACHEL KHOO", role: "Chef & Author", quote: "Creativity in the kitchen is about finding the best ingredients for your soul.", img: "https://i.pravatar.cc/150?u=12" },
];

function TestimonialCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 3, // Scrolled in groups of 3 to match 4 dots (12/3 = 4)
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } }
    ],
    appendDots: dots => (
      <div style={{ bottom: "-60px" }}>
        <ul className="flex justify-center items-center gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-2.5 h-2.5 bg-white/30 rounded-full transition-all duration-300 hover:bg-white/50"></div>
    )
  };

  return (
    <div className=" py-20 px-4 ">
      <div className="max-w-7xl mx-auto">
        <Slider {...settings} className="testimonial-slider">
          {testimonials.map((item) => (
            <div key={item.id} className="px-3 outline-none">
              <div className="bg-[#1B2F5B] text-white p-10 rounded-3xl min-h-75 flex flex-col justify-between border border-white/5 hover:border-white/20 transition-colors shadow-2xl">
                
                {/* Quote Section */}
                <p className="text-lg leading-relaxed font-normal opacity-90 italic">
                  “{item.quote}”
                </p>

                {/* Footer Section */}
                <div className="flex justify-between items-end mt-5">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-sm tracking-widest uppercase">
                      {item.name}
                    </h4>
                    <p className="text-xs text-blue-200/60 mt-2 leading-snug font-medium">
                      {item.role}
                    </p>
                  </div>
                  
                  {/* Avatar Circle */}
                  <div className="shrink-0 w-24 h-24 rounded-full overflow-hidden border-[6px] border-[#2a3c74] shadow-lg">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all"
                    />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Custom styles for the active dot state */}
      <style jsx global>{`
        .testimonial-slider .slick-dots li {
          margin: 0;
          width: auto;
          height: auto;
        }
        .testimonial-slider .slick-dots li.slick-active div {
          background-color: #3b82f6 !important;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}

export default TestimonialCarousel;