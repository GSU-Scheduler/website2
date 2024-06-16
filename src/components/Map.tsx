import React from 'react';

const Map: React.FC = () => {
  return (
    <div className="h-full w-full">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.8258700186494!2d-84.3911266850395!3d33.755636980689224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88f5046170043177%3A0x106c2c5e43f20603!2sGeorgia%20State%20University!5e0!3m2!1sen!2sus!4v1615947551695!5m2!1sen!2sus"
        width="100%"
        height="100%"
        allowFullScreen={true}
        loading="lazy"
        title="Map"
      ></iframe>
    </div>
  );
};

export default Map;