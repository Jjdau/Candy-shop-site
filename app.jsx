// app.jsx
// @ts-nocheck
/* eslint-disable */
console.log("Starting script execution");
if (!window.React || !window.ReactDOM || !window.Babel) {
  console.error("Required scripts (React, ReactDOM, or Babel) failed to load");
  document.getElementById("root").style.display = "none";
  document.getElementById("fallback").style.display = "block";
  throw new Error("Script loading failed");
}
console.log("Scripts loaded: React, ReactDOM, Babel");

/** ErrorBoundary Component */
const ErrorBoundary = ({ children }) => {
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    const errorHandler = (errorEvent) => {
      console.error("Caught error:", errorEvent.error || errorEvent);
      setError(errorEvent.error?.message || "An unexpected error occurred");
    };
    window.addEventListener("error", errorHandler);
    return () => window.removeEventListener("error", errorHandler);
  }, []);
  if (error) {
    return (
      <div className="error-boundary">
        <h2>Error: Something went wrong</h2>
        <p>{error}</p>
        <p>Please check the console for details and share with support.</p>
      </div>
    );
  }
  return children;
};

/** hashPassword */
const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
};
const ADMIN_HASH = hashPassword('TheCandyShopLLC319*');

/** sanitizeInput */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/[&<>"]/g, (m) => ({ '&': '&', '<': '<', '>': '>', '"': '"' }[m]));
};

/** AdminModal Component */
const AdminModal = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = React.useState("");
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginAttempts >= 3) {
      alert("Too many attempts. Please try again later.");
      return;
    }
    setLoginAttempts(loginAttempts + 1);
    onLogin(hashPassword(password));
    setPassword("");
  };
  if (!isOpen) return null;
  return (
    <div className="admin-modal" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold text-center mb-4 candy-text">Admin Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-password" className="block text-gray-600">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(sanitizeInput(e.target.value))}
              className="w-full p-2 border rounded"
              required
              autoComplete="current-password"
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="flex-1 bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Login</button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-700">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** ImageModal Component */
const ImageModal = ({ isOpen, onClose, imageSrc }) => {
  if (!isOpen) return null;
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageSrc} alt="Full size" className="w-full h-auto" />
        <button onClick={onClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700">Close</button>
      </div>
    </div>
  );
};

/** NavBar Component */
const NavBar = ({ adminMode, setAdminMode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [clickCount, setClickCount] = React.useState(0);
  const [showAdminModal, setShowAdminModal] = React.useState(false);
  React.useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);
  const handleLogoClick = (e) => {
    e.preventDefault();
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowAdminModal(true);
        return 0;
      }
      return newCount;
    });
  };
  const handleAdminLogin = (hashedPassword) => {
    if (hashedPassword === ADMIN_HASH) {
      setAdminMode(true);
      setShowAdminModal(false);
    } else {
      alert("Incorrect password");
    }
  };
  const closeMenu = () => setIsOpen(false);
  return (
    <>
      <nav className="bg-pink-500 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 navbar-container">
          <div className="flex justify-between h-16">
            <div className="navbar-logo-container">
              <div onClick={handleLogoClick} className="cursor-pointer">
                <img src="assets/logo.png" alt="The Candy Shop LLC" className="w-auto logo navbar-logo" onError={(e) => { e.target.src = "https://via.placeholder.com/150x32?text=Logo"; }} />
              </div>
            </div>
            <div className="hidden md:flex space-x-4 items-center">
              <a href="#home" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Home</a>
              <a href="#about" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>About</a>
              <a href="#gallery" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Gallery</a>
              <a href="#reviews" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Reviews</a>
              <a href="#events" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Events</a>
              <a href="#contact" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Contact</a>
              <a href="#sale" className="hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Sale</a>
              {adminMode && <button onClick={() => { setAdminMode(false); closeMenu(); }} className="hover:bg-pink-700 px-3 py-2 rounded candy-text">Logout</button>}
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                {isOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#home" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Home</a>
              <a href="#about" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>About</a>
              <a href="#gallery" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Gallery</a>
              <a href="#reviews" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Reviews</a>
              <a href="#events" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Events</a>
              <a href="#contact" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Contact</a>
              <a href="#sale" className="block hover:bg-pink-700 px-3 py-2 rounded candy-text" onClick={closeMenu}>Sale</a>
              {adminMode && <button onClick={() => { setAdminMode(false); closeMenu(); }} className="block hover:bg-pink-700 px-3 py-2 rounded candy-text">Logout</button>}
            </div>
          </div>
        )}
      </nav>
      <AdminModal isOpen={showAdminModal} onClose={() => setShowAdminModal(false)} onLogin={handleAdminLogin} />
    </>
  );
};

/** Hero Component */
const Hero = () => (
  <section id="home" className="gradient-bg text-white py-20 text-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center hero-container">
      <img src="assets/logo.png" alt="The Candy Shop LLC" className="w-auto candy-bounce hero-logo logo" onError={(e) => { e.target.src = "https://via.placeholder.com/300x96?text=Logo"; }} />
      <p className="mt-4 text-lg md:text-2xl candy-text">Your Mobile Candy & Convenience Store!</p>
      <p className="mt-2 text-md md:text-lg candy-text">Bringing Sweet Treats to You!</p>
      <a href="#contact" className="mt-6 inline-block bg-yellow-400 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-500 candy-text">Get in Touch</a>
    </div>
  </section>
);

/** About Component */
const About = ({ adminMode }) => {
  const [aboutText, setAboutText] = React.useState(() => {
    const saved = localStorage.getItem('aboutText');
    try {
      return saved ? JSON.parse(saved) : "The Candy Shop LLC is your go-to mobile candy and convenience store, delivering a burst of sweetness wherever you are! From gummy bears to chocolate bars and savory snacks, we’ve got it all. Follow us on social media to find our next stop!";
    } catch (e) {
      console.error("Failed to parse aboutText from localStorage:", e);
      return "The Candy Shop LLC is your go-to mobile candy and convenience store, delivering a burst of sweetness wherever you are! From gummy bears to chocolate bars and savory snacks, we’ve got it all. Follow us on social media to find our next stop!";
    }
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(aboutText);
  React.useEffect(() => {
    localStorage.setItem('aboutText', JSON.stringify(aboutText));
  }, [aboutText]);
  const handleEdit = () => {
    setIsEditing(true);
    setEditText(aboutText);
  };
  const handleSave = (e) => {
    e.preventDefault();
    setAboutText(sanitizeInput(editText));
    setIsEditing(false);
  };
  return (
    <section id="about" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 candy-text">About Us</h2>
        {isEditing && adminMode ? (
          <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-4">
            <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full p-2 border rounded" rows="5" required autoComplete="off"></textarea>
            <div className="flex space-x-4">
              <button type="submit" className="flex-1 bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Save</button>
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-700">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            <p>{aboutText}</p>
            {adminMode && <button onClick={handleEdit} className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700">Edit</button>}
          </div>
        )}
      </div>
    </section>
  );
};

/** Gallery Component */
const Gallery = ({ adminMode }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [photos, setPhotos] = React.useState([]);
  const [newPhoto, setNewPhoto] = React.useState({ image: null, imageUrl: "", caption: "" });
  const [editPhoto, setEditPhoto] = React.useState(null);

  React.useEffect(() => {
    if (window.firebase && window.firebase.firestore) {
      const unsubscribe = window.firebase.firestore().collection("photos").onSnapshot((snapshot) => {
        setPhotos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        console.log("Fetched photos:", snapshot.docs.map(doc => doc.data()));
      }, (error) => {
        console.error("Error fetching photos:", error);
      });
      return () => unsubscribe();
    } else {
      console.error("Firebase Firestore not available");
    }
  }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = window.firebase.storage().ref();
    const fileRef = storageRef.child(`photos/${file.name}`);
    await fileRef.put(file);
    const url = await fileRef.getDownloadURL();
    return url;
  };

  const savePhoto = async (photo, file) => {
    let imageUrl = photo.imageUrl;
    if (file) {
      imageUrl = await uploadImage(file);
    }
    const photoData = { caption: sanitizeInput(photo.caption), url: imageUrl };
    if (photo.id) {
      await window.firebase.firestore().collection("photos").doc(photo.id).set(photoData);
    } else {
      await window.firebase.firestore().collection("photos").add(photoData);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (newPhoto.image && newPhoto.caption) {
      await savePhoto(newPhoto, newPhoto.image);
      setNewPhoto({ image: null, imageUrl: "", caption: "" });
    }
  };

  const handleEditPhoto = (photo) => setEditPhoto({ ...photo, image: null, imageUrl: photo.url });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editPhoto.url && editPhoto.caption) {
      await savePhoto(editPhoto, editPhoto.image);
      setEditPhoto(null);
    }
  };

  const handleDeletePhoto = async (id) => {
    await window.firebase.firestore().collection("photos").doc(id).delete();
    setEditPhoto(null);
  };

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setModalOpen(true);
  };

  return (
    <section id="gallery" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 candy-text">Our Sweet Vibes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <img src={photo.url} alt={photo.caption} className="w-full h-48 object-cover rounded-lg cursor-pointer" onClick={() => handleImageClick(photo.url)} onError={(e) => { console.error(`Image load failed for ${photo.url}:`, e); e.target.src = "https://via.placeholder.com/150x150?text=No+Image"; }} />
              <p className="mt-2 text-center text-gray-600">{photo.caption}</p>
              {adminMode && (
                <div className="mt-2 flex space-x-2 justify-center">
                  <button onClick={() => handleEditPhoto(photo)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleDeletePhoto(photo.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {adminMode && !editPhoto && (
          <div className="max-w-md mx-auto mt-8">
            <h3 className="text-2xl font-bold text-center mb-4 candy-text">Add New Photo</h3>
            <form onSubmit={handleAddPhoto} className="space-y-4">
              <div>
                <label htmlFor="photo-image" className="block text-gray-600">Image</label>
                <input id="photo-image" type="file" accept="image/*" onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.files[0] })} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="photo-caption" className="block text-gray-600">Caption</label>
                <input id="photo-caption" type="text" value={newPhoto.caption} onChange={(e) => setNewPhoto({ ...newPhoto, caption: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Add Photo</button>
            </form>
          </div>
        )}
        {adminMode && editPhoto && (
          <div className="max-w-md mx-auto mt-8">
            <h3 className="text-2xl font-bold text-center mb-4 candy-text">Edit Photo</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-photo-image" className="block text-gray-600">Image</label>
                <input id="edit-photo-image" type="file" accept="image/*" onChange={(e) => setEditPhoto({ ...editPhoto, image: e.target.files[0] })} className="w-full p-2 border rounded" />
                <p className="text-sm text-gray-500">Current: {editPhoto.imageUrl}</p>
              </div>
              <div>
                <label htmlFor="edit-photo-caption" className="block text-gray-600">Caption</label>
                <input id="edit-photo-caption" type="text" value={editPhoto.caption} onChange={(e) => setEditPhoto({ ...editPhoto, caption: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Save</button>
                <button type="button" onClick={() => setEditPhoto(null)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageSrc={selectedImage} />
    </section>
  );
};

/** Reviews Component */
const Reviews = ({ adminMode }) => {
  const [reviews, setReviews] = React.useState([]);
  React.useEffect(() => {
    if (window.firebase && window.firebase.firestore) {
      const unsubscribe = window.firebase.firestore().collection("reviews").onSnapshot((snapshot) => {
        setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Error fetching reviews:", error);
      });
      return () => unsubscribe();
    } else {
      console.error("Firebase Firestore not available");
    }
  }, []);

  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [newReview, setNewReview] = React.useState({ name: "", rating: 5, comment: "" });
  const [isFormOpen, setIsFormOpen] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % (reviews.length || 1)), 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.name && newReview.comment) {
      const newReviewData = { name: sanitizeInput(newReview.name), rating: newReview.rating, comment: sanitizeInput(newReview.comment), timestamp: new Date() };
      await window.firebase.firestore().collection("reviews").add(newReviewData);
      setNewReview({ name: "", rating: 5, comment: "" });
      setIsFormOpen(false);
    }
  };

  const handleDelete = async (id) => {
    await window.firebase.firestore().collection("reviews").doc(id).delete();
    setCurrentIndex((prev) => (prev >= reviews.length - 1 ? 0 : prev));
  };

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);

  return (
    <section id="reviews" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4 candy-text">What Our Customers Say</h2>
        <p className="text-center text-gray-600 mb-8">Reviews are synced in real-time via Firebase.</p>
        <div className="carousel-container mb-8">
          <div className="relative">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-yellow-400 mb-2 flex justify-center">
                {reviews[currentIndex]?.rating ? (
                  Array.from({ length: Math.floor(reviews[currentIndex].rating) }, (_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  ))
                ) : null}
                {(reviews[currentIndex]?.rating % 1 !== 0) && (
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" clipPath="url(#half)"/>
                    <defs><clipPath id="half"><rect x="0" y="0" width="12" height="24"/></clipPath></defs>
                  </svg>
                )}
              </div>
              <p className="text-gray-600 mb-4">"{reviews[currentIndex]?.comment || 'No reviews yet'}"</p>
              <p className="font-semibold">{reviews[currentIndex]?.name || 'Anonymous'}</p>
              {adminMode && reviews[currentIndex]?.id && <button onClick={() => handleDelete(reviews[currentIndex].id)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>}
            </div>
            <button onClick={handlePrev} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full flex items-center justify-center" aria-label="Previous review">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <button onClick={handleNext} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-pink-500 text-white p-2 rounded-full flex items-center justify-center" aria-label="Next review">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="max-w-lg mx-auto">
          <button onClick={() => setIsFormOpen(!isFormOpen)} className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-700 mb-4">{isFormOpen ? "Hide Review Form" : "Leave a Review"}</button>
          <div className={`dropdown-form ${isFormOpen ? 'visible' : 'hidden'}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-600">Name</label>
                <input id="name" type="text" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} className="w-full p-2 border rounded" required aria-required="true" autoComplete="name" />
              </div>
              <div>
                <label htmlFor="rating" className="block text-gray-600">Rating</label>
                <select id="rating" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })} className="w-full p-2 border rounded" aria-required="true">
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="block text-gray-600">Comment</label>
                <textarea id="comment" value={newReview.comment} onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })} className="w-full p-2 border rounded" rows="4" required aria-required="true" autoComplete="off"></textarea>
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

/** Events Component */
const Events = ({ adminMode }) => {
  const [events, setEvents] = React.useState([]);
  React.useEffect(() => {
    if (window.firebase && window.firebase.firestore) {
      const unsubscribe = window.firebase.firestore().collection("events").onSnapshot((snapshot) => {
        setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }, (error) => {
        console.error("Error fetching events:", error);
      });
      return () => unsubscribe();
    } else {
      console.error("Firebase Firestore not available");
    }
  }, []);

  const [selectedDay, setSelectedDay] = React.useState(null);
  const [weekOffset, setWeekOffset] = React.useState(0);
  const [newEvent, setNewEvent] = React.useState({ title: "", date: "", time: "", location: "" });
  const [editEvent, setEditEvent] = React.useState(null);

  const getWeekDays = () => {
    const today = new Date();
    today.setDate(today.getDate() + weekOffset * 7);
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      const dateStr = day.toISOString().split('T')[0];
      days.push({ date: dateStr, label: day.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }) });
    }
    return days;
  };

  const handleDayClick = (date) => {
    setSelectedDay((prev) => (prev === date ? null : date));
    setEditEvent(null);
  };

  const handleAllEventsClick = () => {
    setSelectedDay((prev) => (prev === 'all' ? null : 'all'));
    setEditEvent(null);
  };

  const handleWeekChange = (direction) => {
    setWeekOffset((prev) => prev + direction);
    setEditEvent(null);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      await window.firebase.firestore().collection("events").add({ title: sanitizeInput(newEvent.title), date: newEvent.date, time: sanitizeInput(newEvent.time), location: sanitizeInput(newEvent.location) });
      setNewEvent({ title: "", date: "", time: "", location: "" });
    }
  };

  const handleEventEdit = (event) => setEditEvent(event);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editEvent.title && editEvent.date && editEvent.time && editEvent.location) {
      await window.firebase.firestore().collection("events").doc(editEvent.id).set({ title: sanitizeInput(editEvent.title), date: editEvent.date, time: sanitizeInput(editEvent.time), location: sanitizeInput(editEvent.location) });
      setEditEvent(null);
    }
  };

  const handleEventDelete = async (id) => {
    await window.firebase.firestore().collection("events").doc(id).delete();
    setEditEvent(null);
  };

  const filteredEvents = selectedDay ? (selectedDay === 'all' ? events : events.filter((event) => new Date(event.date).toISOString().split('T')[0] === selectedDay)) : [];

  return (
    <section id="events" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 candy-text">Where to Find Us</h2>
        <div className="flex justify-between mb-4">
          <button onClick={() => handleWeekChange(-1)} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700">Previous Week</button>
          <button onClick={() => handleWeekChange(1)} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700">Next Week</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
          {getWeekDays().map((day) => (
            <div key={day.date} onClick={() => handleDayClick(day.date)} className={`calendar-day p-4 text-center rounded-lg ${selectedDay === day.date ? 'selected' : 'bg-gray-100'}`}>
              {day.label}
            </div>
          ))}
          <div onClick={handleAllEventsClick} className={`calendar-day p-4 text-center rounded-lg ${selectedDay === 'all' ? 'selected' : 'bg-gray-100'}`}>All Events</div>
        </div>
        <ul className="space-y-4 mb-8">
          {selectedDay === null ? (
            <p className="text-center text-gray-600">Select a date or "All Events" to view events</p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li key={event.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{event.title}</h3>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  <p><strong>Time:</strong> {event.time}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>
                {adminMode && (
                  <div className="flex space-x-2">
                    <button onClick={() => handleEventEdit(event)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleEventDelete(event.id)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Delete</button>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No events for this selection.</p>
          )}
        </ul>
        {adminMode && editEvent && (
          <div className="max-w-md mx-auto mb-8">
            <h3 className="text-2xl font-bold text-center mb-4 candy-text">Edit Event</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-title" className="block text-gray-600">Event Title</label>
                <input id="edit-title" type="text" value={editEvent.title} onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="edit-date" className="block text-gray-600">Date (YYYY-MM-DD)</label>
                <input id="edit-date" type="date" value={editEvent.date} onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="edit-time" className="block text-gray-600">Time (e.g., 8:00 AM - 2:00 PM)</label>
                <input id="edit-time" type="text" value={editEvent.time} onChange={(e) => setEditEvent({ ...editEvent, time: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="edit-location" className="block text-gray-600">Location (e.g., Main St., Cedar Rapids, IA)</label>
                <input id="edit-location" type="text" value={editEvent.location} onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })} className="w-full p-2 border rounded" required autoComplete="address-line1" />
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Save</button>
                <button type="button" onClick={() => setEditEvent(null)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        )}
        {adminMode && !editEvent && (
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center mb-4 candy-text">Add Event</h3>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-600">Event Title</label>
                <input id="title" type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="date" className="block text-gray-600">Date (YYYY-MM-DD)</label>
                <input id="date" type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="time" className="block text-gray-600">Time (e.g., 8:00 AM - 2:00 PM)</label>
                <input id="time" type="text" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="location" className="block text-gray-600">Location (e.g., Main St., Cedar Rapids, IA)</label>
                <input id="location" type="text" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} className="w-full p-2 border rounded" required autoComplete="address-line1" />
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Add Event</button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

/** Sale Component */
const Sale = ({ adminMode }) => {
  const [items, setItems] = React.useState([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [newItem, setNewItem] = React.useState({ category: "", image: null, imageUrl: "", description: "", price: 0, sold: false });
  const [editItem, setEditItem] = React.useState(null);
  const [categoryFilter, setCategoryFilter] = React.useState("All");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    if (window.firebase && window.firebase.firestore) {
      const unsubscribe = window.firebase.firestore().collection("sales").onSnapshot((snapshot) => {
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        console.log("Fetched sales items:", snapshot.docs.map(doc => doc.data()));
      }, (error) => {
        console.error("Error fetching sales items:", error);
      });
      return () => unsubscribe();
    } else {
      console.error("Firebase Firestore not available");
    }
  }, []);

  const uploadImage = async (file) => {
    if (!file) return null;
    const storageRef = window.firebase.storage().ref();
    const fileRef = storageRef.child(`sales/${file.name}`);
    await fileRef.put(file);
    const url = await fileRef.getDownloadURL();
    return url;
  };

  const saveItem = async (item, file) => {
    let imageUrl = item.imageUrl;
    if (file) {
      imageUrl = await uploadImage(file);
    }
    const itemData = {
      category: sanitizeInput(item.category),
      description: sanitizeInput(item.description),
      price: parseFloat(item.price) || 0,
      sold: !!item.sold,
      imageUrl,
    };
    if (item.id) {
      await window.firebase.firestore().collection("sales").doc(item.id).set(itemData);
    } else {
      await window.firebase.firestore().collection("sales").add(itemData);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (newItem.category && newItem.description && newItem.price && newItem.image) {
      await saveItem(newItem, newItem.image);
      setNewItem({ category: "", image: null, imageUrl: "", description: "", price: 0, sold: false });
      setDropdownOpen(false);
    }
  };

  const handleEditItem = (item) => setEditItem({ ...item, image: null, imageUrl: item.imageUrl });

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editItem.category && editItem.description && editItem.price && editItem.imageUrl) {
      await saveItem(editItem, editItem.image);
      setEditItem(null);
    }
  };

  const handleDeleteItem = async (id) => {
    await window.firebase.firestore().collection("sales").doc(id).delete();
    setEditItem(null);
  };

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setModalOpen(true);
  };

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems = categoryFilter === "All" ? items : items.filter((item) => item.category === categoryFilter);

  return (
    <section id="sale" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8 candy-text">Sweet Deals</h2>
        <div className="mb-8">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700">
            {dropdownOpen ? "Close Filter" : "Filter by Category"}
          </button>
          {dropdownOpen && (
            <div className="mt-2">
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full p-2 border rounded">
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="sale-item-container">
              <img src={item.imageUrl} alt={item.description} className="sale-item-image" onClick={() => handleImageClick(item.imageUrl)} onError={(e) => { console.error(`Image load failed for ${item.imageUrl}:`, e); e.target.src = "https://via.placeholder.com/150x150?text=No+Image"; }} />
              {item.sold && <span className="sale-item-sold">SOLD</span>}
              <h3 className="sale-item-title">{item.description}</h3>
              <p className="sale-item-text">Category: {item.category}</p>
              <p className="sale-item-text">Price: ${parseFloat(item.price).toFixed(2)}</p>
              {adminMode && (
                <div className="mt-2 flex space-x-2 justify-center">
                  <button onClick={() => handleEditItem(item)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => handleDeleteItem(item.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700">Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {adminMode && !editItem && (
          <div className="max-w-md mx-auto mt-8">
            <h3 className="text-2xl font-bold text-center mb-4 candy-text">Add New Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label htmlFor="item-category" className="block text-gray-600">Category</label>
                <input id="item-category" type="text" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="item-image" className="block text-gray-600">Image</label>
                <input id="item-image" type="file" accept="image/*" onChange={(e) => setNewItem({ ...newItem, image: e.target.files[0] })} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label htmlFor="item-description" className="block text-gray-600">Description</label>
                <input id="item-description" type="text" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="item-price" className="block text-gray-600">Price ($)</label>
                <input id="item-price" type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="item-sold" className="block text-gray-600">
                  <input id="item-sold" type="checkbox" checked={newItem.sold} onChange={(e) => setNewItem({ ...newItem, sold: e.target.checked })} className="mr-2" />
                  Sold
                </label>
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Add Item</button>
            </form>
          </div>
        )}
        {adminMode && editItem && (
          <div className="max-w-md mx-auto mt-8">
            <h3 className="text-2xl font-bold text-center mb-4 candy-text">Edit Item</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="edit-item-category" className="block text-gray-600">Category</label>
                <input id="edit-item-category" type="text" value={editItem.category} onChange={(e) => setEditItem({ ...editItem, category: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="edit-item-image" className="block text-gray-600">Image</label>
                <input id="edit-item-image" type="file" accept="image/*" onChange={(e) => setEditItem({ ...editItem, image: e.target.files[0] })} className="w-full p-2 border rounded" />
                <p className="text-sm text-gray-500">Current: {editItem.imageUrl}</p>
              </div>
              <div>
                <label htmlFor="edit-item-description" className="block text-gray-600">Description</label>
                <input id="edit-item-description" type="text" value={editItem.description} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="edit-item-price" className="block text-gray-600">Price ($)</label>
                <input id="edit-item-price" type="number" step="0.01" value={editItem.price} onChange={(e) => setEditItem({ ...editItem, price: e.target.value })} className="w-full p-2 border rounded" required autoComplete="off" />
              </div>
              <div>
                <label htmlFor="edit-item-sold" className="block text-gray-600">
                  <input id="edit-item-sold" type="checkbox" checked={editItem.sold} onChange={(e) => setEditItem({ ...editItem, sold: e.target.checked })} className="mr-2" />
                  Sold
                </label>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-pink-500 text-white p-2 rounded hover:bg-pink-700">Save</button>
                <button type="button" onClick={() => setEditItem(null)} className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ImageModal isOpen={modalOpen} onClose={() => setModalOpen(false)} imageSrc={selectedImage} />
    </section>
  );
};

/** Contact Component */
const Contact = () => (
  <section id="contact" className="py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-center mb-8 candy-text">Contact Us</h2>
      <div className="max-w-lg mx-auto text-center">
        <p className="text-lg text-gray-600 mb-4">
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H8"></path>
          </svg>
          <a href="mailto:TheCandyShop319@gmail.com" className="text-pink-500 hover:underline">TheCandyShop319@gmail.com</a>
        </p>
        <p className="text-lg text-gray-600 mb-4">
          <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Follow our mobile shop on social media!
        </p>
        <div className="flex justify-center space-x-4">
          <a href="https://www.facebook.com/people/The-Candy-Shop-LLC/61575132523484/" className="text-2xl text-pink-500 hover:text-pink-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/crcandyshop" className="text-2xl text-pink-500 hover:text-pink-700">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.524.069-2.917.375-3.999 1.456C1.974 2.61 1.668 4.003 1.6 5.527c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.069 1.524.375 2.917 1.456 3.999 1.081 1.081 2.475 1.387 3.999 1.456 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.524-.069 2.917-.375 3.999-1.456 1.081-1.081 1.387-2.475 1.456-3.999.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.069-1.524-.375-2.917-1.456-3.999-1.081-1.081-2.475-1.387-3.999-1.456-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

/** Footer Component */
const Footer = () => (
  <footer className="bg-pink-500 text-white py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center footer-container">
      <img src="assets/logo.png" alt="The Candy Shop LLC" className="w-auto logo footer-logo" onError={(e) => { e.target.src = "https://via.placeholder.com/150x32?text=Logo"; }} />
      <p className="mt-4 text-center">© {new Date().getFullYear()} The Candy Shop LLC. All rights reserved.</p>
      <div className="mt-4 flex space-x-4">
        <a href="https://www.facebook.com/people/The-Candy-Shop-LLC/61575132523484/" className="text-white hover:text-yellow-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V12h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
          </svg>
        </a>
        <a href="https://www.instagram.com/crcandyshop" className="text-white hover:text-yellow-400">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.266-.058 1.646-.07 4.85-.07m0-2.163c-3.259 0-3.667.014-4.947.072-1.524.069-2.917.375-3.999 1.456C1.974 2.61 1.668 4.003 1.6 5.527c-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.069 1.524.375 2.917 1.456 3.999 1.081 1.081 2.475 1.387 3.999 1.456 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.524-.069 2.917-.375 3.999-1.456 1.081-1.081 1.387-2.475 1.456-3.999.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.069-1.524-.375-2.917-1.456-3.999-1.081-1.081-2.475-1.387-3.999-1.456-1.28-.058-1.688-.072-4.947-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.441s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.441-1.441-1.441z"/>
          </svg>
        </a>
      </div>
    </div>
  </footer>
);

/** App Component */
const App = () => {
  const [adminMode, setAdminMode] = React.useState(false);
  console.log("Attempting to render app");
  return (
    <ErrorBoundary>
      <div>
        <NavBar adminMode={adminMode} setAdminMode={setAdminMode} />
        <Hero />
        <About adminMode={adminMode} />
        <Gallery adminMode={adminMode} />
        <Reviews adminMode={adminMode} />
        <Events adminMode={adminMode} />
        <Sale adminMode={adminMode} />
        <Contact />
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

console.log("Attempting to render app");
ReactDOM.render(<App />, document.getElementById('root'));
console.log("App rendered successfully");