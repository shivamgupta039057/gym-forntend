import React from 'react';
import wpIcon from '../../images/wpIcon.png';

const WhatsAppComponent = ({ phoneNumber, message, pdfLink }) => {
  // Encode the message with the PDF link
  const encodedMessage = encodeURIComponent(`${message}\nDownload your prescription here: ${pdfLink}`);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=+91${phoneNumber}&text=${encodedMessage}&app_absent=0`;

  return (
    <button
      className="p-0 border-0 bg-transparent flex items-center justify-center"
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <img className="h-10 flex" src={wpIcon} alt="WhatsApp Icon" />
    </button>
  );
};

export default WhatsAppComponent;
