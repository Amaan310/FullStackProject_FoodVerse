/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { BsStopwatch, BsPerson } from 'react-icons/bs';
import {
  FaYoutube,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaLink,
  FaQrcode,
  FaImage,
  FaDownload,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';

export default function RecipeDetails() {
  const recipe = useLoaderData();

  const [isQrOpen, setIsQrOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // ✅ Ref for Instagram-ready image capture
  const cardRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  // ✅ Normalize YouTube link
  const getYoutubeLink = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // if user only pasted ID
    return `https://www.youtube.com/watch?v=${trimmed}`;
  };

  const youtubeLink = recipe.youtubeUrl ? getYoutubeLink(recipe.youtubeUrl) : '';

  // ✅ Sharing helpers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const title = recipe.title || 'Check out this recipe on FoodVerse';

  // 🔥 Fun & casual share message
  const shareMessage = `🍽️ You HAVE to try this!

🔥 ${title}
⏱️ ${recipe.time} min
👨‍🍳 By ${recipe.username || 'FoodVerse Chef'}

👇 Full recipe here:
${currentUrl}

#FoodVerse #HomeCooking #FoodLovers`;

  const handleShareWhatsApp = () => {
    if (!currentUrl) return;
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  const handleShareFacebook = () => {
    if (!currentUrl) return;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
    window.open(url, '_blank');
  };

  const handleShareTwitter = () => {
    if (!currentUrl) return;
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      currentUrl
    )}&text=${encodeURIComponent(title)}`;
    window.open(url, '_blank');
  };

  const handleCopyLink = async () => {
    if (!currentUrl) return;

    try {
      // We copy the fun share message, not just URL
      const textToCopy = shareMessage;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const qrImageUrl =
    currentUrl &&
    `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      currentUrl
    )}`;

  // ✅ Instagram-ready image download (square card)
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 1,
      });

      const link = document.createElement('a');
      const safeTitle = (recipe.title || 'recipe').replace(/\s+/g, '-');
      link.download = `${safeTitle}-foodverse.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating Instagram image:', error);
    }
  };

  // ✅ Pretty, branded PDF download
  const handleDownloadPDF = async () => {
    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const marginX = 40;
      const marginBottom = 60;

      const safeTitle = recipe.title || 'Recipe';
      const author = recipe.username || 'Anonymous Chef';
      const timeText = `${recipe.time} min`;

      // 🔴 FoodVerse header bar
      doc.setFillColor(239, 68, 68); // red-500
      doc.rect(0, 0, pageWidth, 70, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('FoodVerse', marginX, 38);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Explore · Cook · Share', marginX, 54);

      let y = 90;
      doc.setTextColor(0, 0, 0);

      // Helper: new page with small header
      const addNewPageWithHeader = () => {
        doc.addPage();
        doc.setFillColor(239, 68, 68);
        doc.rect(0, 0, pageWidth, 50, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text(`FoodVerse · ${safeTitle}`, marginX, 32);
        y = 80;
        doc.setTextColor(0, 0, 0);
      };

      const ensureSpace = (neededHeight = 40) => {
        if (y + neededHeight > pageHeight - marginBottom) {
          addNewPageWithHeader();
        }
      };

      // 🖼 Hero image (larger & centered)
      const contentWidth = pageWidth - marginX * 2;
      let imgData = null;

      if (recipe.coverImage) {
        const imgUrl = `${import.meta.env.VITE_API_URL}/images/${recipe.coverImage}`;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imgUrl;

        await new Promise((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });

        if (img.width && img.height) {
          const maxImgWidth = contentWidth;
          const maxImgHeight = 220;

          let imgWidth = maxImgWidth;
          let imgHeight = (img.height / img.width) * imgWidth;

          if (imgHeight > maxImgHeight) {
            const scale = maxImgHeight / imgHeight;
            imgHeight = maxImgHeight;
            imgWidth = imgWidth * scale;
          }

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          imgData = canvas.toDataURL('image/jpeg', 0.9);

          const imgX = marginX + (contentWidth - imgWidth) / 2;
          doc.addImage(imgData, 'JPEG', imgX, y, imgWidth, imgHeight);
          y += imgHeight + 24;
        }
      }

      // 🏷 Title + meta
      ensureSpace(80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text(safeTitle, marginX, y);
      y += 26;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(75, 85, 99); // gray-600
      doc.text(`By: ${author}`, marginX, y);
      y += 16;
      doc.text(`Time: ${timeText}`, marginX, y);
      y += 24;

      // 🥗 Ingredients heading
      ensureSpace(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38); // red-600
      doc.text('Ingredients', marginX, y);
      y += 18;

      // Ingredients list
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(55, 65, 81); // gray-700

      recipe.ingredients.forEach((ing) => {
        const lines = doc.splitTextToSize(`• ${ing}`, contentWidth);
        const needed = lines.length * 14 + 4;
        ensureSpace(needed);
        doc.text(lines, marginX, y);
        y += needed;
      });

      y += 10;

      // 🪜 Instructions heading
      ensureSpace(40);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(220, 38, 38);
      doc.text('Instructions', marginX, y);
      y += 18;

      // Instructions list
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(55, 65, 81);

      const steps = recipe.instructions.split('\n').filter((s) => s.trim() !== '');

      steps.forEach((step, idx) => {
        const prefix = `${idx + 1}. `;
        const lines = doc.splitTextToSize(prefix + step, contentWidth);
        const needed = lines.length * 14 + 6;
        ensureSpace(needed);
        doc.text(lines, marginX, y);
        y += needed;
      });

      // 🔻 Footer on last page
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      const footerY1 = pageHeight - 36;
      const footerY2 = pageHeight - 22;

      doc.text('Made with FoodVerse', marginX, footerY1);

      if (currentUrl) {
        const urlText = `View online: ${currentUrl}`;
        const wrappedUrl = doc.splitTextToSize(urlText, contentWidth);
        doc.text(wrappedUrl, marginX, footerY2);
      }

      doc.save(`${safeTitle.replace(/\s+/g, '-')}-foodverse.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-rose-50 to-orange-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* LEFT COLUMN: IMAGE + SHARE */}
          <motion.div className="lg:col-span-2 lg:sticky lg:top-24 h-max" variants={imageVariants}>
            {/* Image + card wrapper (used for Instagram image) */}
            <div
              ref={cardRef}
              className="bg-white rounded-2xl shadow-xl overflow-hidden aspect-w-1 aspect-h-1 flex flex-col"
            >
              <img
                src={
                  recipe.coverImage
                    ? `${import.meta.env.VITE_API_URL}/images/${recipe.coverImage}`
                    : 'https://via.placeholder.com/600x600.png?text=Image+Not+Found'
                }
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Share section under the image */}
            <motion.div
              variants={itemVariants}
              className="mt-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg px-4 py-3 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-700">Share this recipe</p>
                {copied && (
                  <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Message copied!
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white shadow-md hover:scale-110 hover:shadow-lg transition-transform duration-200"
                  aria-label="Share on WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:scale-110 hover:shadow-lg transition-transform duration-200"
                  aria-label="Share on Facebook"
                >
                  <FaFacebookF className="w-4 h-4" />
                </button>

                {/* X / Twitter */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black text-white shadow-md hover:scale-110 hover:shadow-lg transition-transform duration-200"
                  aria-label="Share on X (Twitter)"
                >
                  <FaTwitter className="w-4 h-4" />
                </button>

                {/* Copy Message */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 hover:scale-110 hover:shadow-lg transition-transform duration-200"
                  aria-label="Copy share message"
                >
                  <FaLink className="w-4 h-4" />
                </button>

                {/* Instagram-ready Image */}
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-500 text-white shadow-md hover:scale-110 hover:shadow-lg transition-transform duration-200"
                  aria-label="Download Instagram image"
                  title="Download Instagram image"
                >
                  <FaImage className="w-4 h-4" />
                </button>

                {/* PDF Download */}
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:scale-110 hover:shadow-lg transition-transform duration-200"
                  aria-label="Download recipe PDF"
                  title="Download recipe PDF"
                >
                  <FaDownload className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: DETAILS */}
          <motion.div className="lg:col-span-3" variants={containerVariants}>
            {/* Title */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              {recipe.title}
            </motion.h1>

            {/* Author, Time, YouTube */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8 text-gray-600"
            >
              <div className="flex items-center">
                <BsPerson className="mr-2 text-red-500" />
                <span>By {recipe.username || 'Anonymous Chef'}</span>
              </div>

              <div className="flex items-center">
                <BsStopwatch className="mr-2 text-red-500" />
                <span>{recipe.time} min</span>
              </div>

              {youtubeLink && (
                <a
                  href={youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-sm font-medium shadow-sm hover:bg-red-700 transition-colors"
                >
                  <FaYoutube className="w-4 h-4" />
                  <span>Watch Tutorial</span>
                </a>
              )}
            </motion.div>

            {/* Ingredients */}
            <motion.div
              variants={itemVariants}
              className="bg-rose-50/50 rounded-xl p-6 mb-8 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ingredients</h2>
              <motion.ul variants={containerVariants} className="space-y-3">
                {recipe.ingredients.map((item, idx) => (
                  <motion.li key={idx} variants={itemVariants} className="flex items-start">
                    <span className="text-red-500 font-bold mr-3 mt-1">&#8226;</span>
                    <span className="text-gray-700">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Instructions */}
            <motion.div
              variants={itemVariants}
              className="bg-amber-50/50 rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Instructions</h2>
              <motion.div variants={containerVariants} className="space-y-4">
                {recipe.instructions.split('\n').map((step, idx) => (
                  <motion.div key={idx} variants={itemVariants} className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-red-500 text-white font-bold mr-4">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* QR Code Modal */}
      {isQrOpen && qrImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full relative">
            <button
              type="button"
              onClick={() => setIsQrOpen(false)}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 text-sm font-bold"
              aria-label="Close QR code"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
              Scan to open this recipe
            </h3>
            <div className="flex justify-center mb-3">
              <img
                src={qrImageUrl}
                alt="Recipe QR Code"
                className="w-40 h-40 rounded-xl border border-gray-200"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              Point your camera at the QR code to open this recipe on another device.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
