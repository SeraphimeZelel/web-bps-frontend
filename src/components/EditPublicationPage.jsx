// Refactoring

import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { usePublications } from "../hooks/usePublications";
import { uploadImageToCloudinary } from "../services/publicationService";

export default function EditPublicationPage(){
  const {id} = useParams();
  const navigate = useNavigate();
  const {publications, editPublication} = usePublications();

  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState("")

  const publicationToEdit = publications.find(p => p.id === parseInt(id));

  useEffect(()=>{
    if (publicationToEdit) {
      setTitle(publicationToEdit.title);
      setReleaseDate(publicationToEdit.releaseDate);
      setCurrentCoverUrl(publicationToEdit.coverUrl);
    }
  }, [publicationToEdit]);

  if (!publicationToEdit){
    return (
      <div className="text-center p-10">
        <p>Publikasi tidak ditemukan.</p>
        <button
          onClick={()=> navigate("/publications")}
          className="mt-4 bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg">
            Kembali
        </button>
      </div>
    );
  }

const handleSubmit = async (e) => {
  e.preventDefault();
  let updatedCoverUrl = currentCoverUrl;

  try {
    if (coverFile) {
      updatedCoverUrl = await uploadImageToCloudinary(coverFile);
    }

    const updatedPublication = {
      ...publicationToEdit,
      title,
      releaseDate,
      coverUrl: updatedCoverUrl,
    };
    await editPublication(publicationToEdit.id, updatedPublication);

    alert("Publikasi berhasil diperbarui");
    navigate("/publications");
  } catch (error) {
    alert("Gagal memperbarui publikasi: " + error.message);
  }
};

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Publikasi</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Judul
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Rilis
          </label>
          <input
            type="date"
            id="releaseDate"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
        <div>
          <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-1">
            Sampul (Gambar)
          </label>
          <div className="mt-2 flex items-center space-x-4">
             <img src={currentCoverUrl} alt="Current Cover" className="h-24 w-auto object-cover rounded shadow-md" />
             <input
                type="file"
                id="cover"
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/publications")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            Batal
          </button>
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
            Simpan
          </button>
        </div>
      </form>
    </div>
  );  
}