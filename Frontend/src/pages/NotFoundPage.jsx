import { Link } from 'react-router-dom';
import { HiOutlineEmojiSad, HiArrowLeft } from 'react-icons/hi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <HiOutlineEmojiSad className="w-24 h-24 text-green-600 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-6">Maaf, halaman yang Anda cari tidak dapat ditemukan.</p>
        <Link 
          to="/"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
        >
          <HiArrowLeft className="mr-2" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
