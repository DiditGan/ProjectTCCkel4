import grafisImage from '../assets/grafis.png';
import yedhitImage from '../assets/Yedhit.jpg';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <>
      <Navbar />     

      {/* Hero Section */}
      <section id="home" className="min-h-screen pt-24 pb-12 px-4 md:px-8 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">GiveTzy</h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              adalah aplikasi berbasis website yang memfasilitasi penjualan barang-barang bekas dengan harga lebih murah. 
              Aplikasi ini dirancang untuk mendorong gaya hidup berkelanjutan dengan cara berbagi
              barang yang masih layak pakai, mengurangi penumpukan barang di rumah, dan mengurangi
              sampah rumah tangga. GiveTzy bukan hanya sekedar marketplace, tetapi lebih fokus pada nilai
              sosial dan lingkungan dengan memberikan kemudahan dalam proses pertukaran dan donasi
              barang.
            </p>
            <Link to="/home" className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
              Jelajahi Sekarang
            </Link>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <img src={grafisImage} alt="Gambar Grafis" className="max-w-full h-auto rounded-lg shadow-xl" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 px-4 md:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-700 mb-4">About Us</h2>
          <div className="h-1 w-24 bg-green-500 mx-auto mb-8"></div>
          <p className="text-gray-700 text-lg text-center max-w-2xl mx-auto mb-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ac venenatis est. Kami berkomitmen untuk menciptakan lingkungan yang lebih berkelanjutan melalui platform GiveTzy.
          </p>
          
          <h3 className="text-2xl font-semibold text-center text-green-600 mb-10">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-green-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={'https://media.licdn.com/dms/image/v2/D4E03AQGYuOSvAtPpkw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696573867504?e=1752710400&v=beta&t=mI5gBIfTsw-O27QqG_3KU04oYUkg-EPzfEB9efCewXc'} alt="Rahel" className="w-40 h-40 object-cover rounded-full border-4 border-green-500 mb-4" />
              <h4 className="text-xl font-medium text-green-800">Rahel Anatasya Sinaga</h4>
              <p className="text-gray-600 mt-2">Frontend Developer</p>
              <div className="flex space-x-3 mt-4">
                <a href="#" className="text-green-600 hover:text-green-800">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-800">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-800">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-green-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <img src={yedhitImage} alt="Yedhit" className="w-40 h-40 object-cover rounded-full border-4 border-green-500 mb-4" />
              <h4 className="text-xl font-medium text-green-800">Yedhit Trisakti Tamma</h4>
              <p className="text-gray-600 mt-2">Backend Developer</p>
              <div className="flex space-x-3 mt-4">
                <a href="#" className="text-green-600 hover:text-green-800">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-800">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-green-600 hover:text-green-800">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">About GiveTzy</h3>
              <p className="text-green-100">
                GiveTzy adalah platform yang memfasilitasi penjualan barang bekas 
                dengan fokus pada nilai sosial dan lingkungan untuk mendorong 
                gaya hidup berkelanjutan.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Useful Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-300">Home</a></li>
                <li><a href="#about" className="text-green-100 hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-300">Terms of Service</a></li>
                <li><a href="#" className="text-green-100 hover:text-white transition-colors duration-300">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-green-600 pb-2">Contact Us</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.7l-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z"/>
                  </svg>
                  <span>GiveTzy220@email.com</span>
                </p>
                <p className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4c0-1.1.9-2 2-2h16zm-7 14h-2v-4h2v4zm0-6h-2V6h2v4z"/>
                  </svg>
                  <span>+62 812-xxxx-xxxx</span>
                </p>
                <p className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  <span>@GiveTzyApp</span>
                </p>
              </div>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors duration-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-green-600 mt-8 pt-6 text-center text-green-200">
            <p>&copy; {new Date().getFullYear()} GiveTzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default LandingPage;
