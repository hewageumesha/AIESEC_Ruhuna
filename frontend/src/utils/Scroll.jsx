import React from "react";

export const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    // First scroll to top in case we're coming from another page
    window.scrollTo(0, 0);
    // Then scroll to the section
    element.scrollIntoView({ behavior: 'smooth' });
  }
};