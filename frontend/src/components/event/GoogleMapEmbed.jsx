import React from 'react';

const GoogleMapEmbed = ({ location }) => {
  if (!location) return null;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyCIS25E6e43YO7cjdgLqdVC50sJdKBbvws&q=${encodeURIComponent(location)}`;

  return (
    <div className="mt-6 rounded-xl overflow-hidden shadow-md">
      <iframe
        title="Google Map"
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
      ></iframe>
    </div>
  );
};

export default GoogleMapEmbed;
