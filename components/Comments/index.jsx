'use client'

import { useEffect, useState } from 'react'
import { getAPI } from '../../services/fetchAPI'
import Loading from '../loading'
import { formatDate } from '../../lib/utils/formatter'
import { commentStatusLocalization } from '../../lib/utils/localizationText'
import { useSession } from 'next-auth/react'

//Gelen yorumunun tipine göre yanında ki icon belirleniyor.
const getStatusIcon = (status) => {
  switch (status) {
    case 'STARTED':
      return (
        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            height="20"
            width="20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z"></path>
          </svg>
        </div>
      )
    case 'COMPLETED':
      return (
        <div class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"></path>
          </svg>
        </div>
      )
    case 'IN_PROGRESS':
      return (
        <div class="w-10 h-10 flex items-center justify-center">
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="16"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="none"
                stroke-width="2"
                d="M1,1 L23,1 M10,4.5 L14,4.5 C14,4.5 14,6 14,6 C14,7 12,8 12,8 C12,8 10,7 10,6 C10,6 10,4.5 10,4.5 Z M5,1 C5,1 5,3 5,6 C5,9 10,9.23530084 10,12 C10,14.7646992 5.00000001,15 5,18 C4.99999999,21 5,23 5,23 M19,1 C19,1 19,3 19,6 C19,9 14,9.23530084 14,12 C14,14.7646992 19,15 19,18 C19,21 19,23 19,23 M1,23 L23,23 M8,21 C8,19 12,17 12,17 C12,17 16,19 16,21 C16,21 16,23 16,23 L8,23 L8,21 Z"
              ></path>
            </svg>
          </div>
        </div>
      )
    case 'COMMENTED':
      return (
        <div class="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"></path>
          </svg>
        </div>
      )
    case 'BUG':
      return (
        <div className="w-10 h-10 flex items-center justify-center">
          <div className="text-red-600">
            <svg
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 512 512"
              height="24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M511.988 288.9c-.478 17.43-15.217 31.1-32.653 31.1H424v16c0 21.864-4.882 42.584-13.6 61.145l60.228 60.228c12.496 12.497 12.496 32.758 0 45.255-12.498 12.497-32.759 12.496-45.256 0l-54.736-54.736C345.886 467.965 314.351 480 280 480V236c0-6.627-5.373-12-12-12h-24c-6.627 0-12 5.373-12 12v244c-34.351 0-65.886-12.035-90.636-32.108l-54.736 54.736c-12.498 12.497-32.759 12.496-45.256 0-12.496-12.497-12.496-32.758 0-45.255l60.228-60.228C92.882 378.584 88 357.864 88 336v-16H32.666C15.23 320 .491 306.33.013 288.9-.484 270.816 14.028 256 32 256h56v-58.745l-46.628-46.628c-12.496-12.497-12.496-32.758 0-45.255 12.498-12.497 32.758-12.497 45.256 0L141.255 160h229.489l54.627-54.627c12.498-12.497 32.758-12.497 45.256 0 12.496 12.497 12.496 32.758 0 45.255L424 197.255V256h56c17.972 0 32.484 14.816 31.988 32.9zM257 0c-61.856 0-112 50.144-112 112h224C369 50.144 318.856 0 257 0z"></path>
            </svg>
          </div>
        </div>
      )
    case 'ASSIGNED':
      return (
        <div class="w-10 h-10 flex items-center justify-center">
          <div class="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 448 512"
              height="14"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
            </svg>
          </div>
        </div>
      )
    default:
      return null
  }
}

const Comments = ({ taskId, refreshPage = false, setEditComment = '' }) => {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const { data: session, status } = useSession()
  const today = formatDate(new Date().toISOString())

  useEffect(() => {
    const getCommentForTask = async () => {
      //taskId il eşleşen o taska ait commentsleri getiriyoruz.
      const res = await getAPI(`/comment/${taskId}/get-comments-user`)

      if (res.status === 'success') {
        setComments(res.comments)
      }
      setLoading(false)
    }
    getCommentForTask()
  }, [refreshPage])
  if (loading) {
    return <Loading />
  }

  //Geçerli taskın hiç yorumu yok ise bu kısım çalışıyor.
  if (comments.length === 0) {
    return <p>Yorum Bulunamadı</p>
  }

  return (
    <div className="flex flex-col gap-4 border w-full p-4">
      <h2 className="text-xl font-semibold text-gray-500">Faaliyetler</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 border-b pb-3 relative ">
          {getStatusIcon(comment.status)}
          <div>
            <h3 className="font-semibold text-lg text-gray-600">
              {comment.user.name}
            </h3>
            <div className="flex gap-4 items-center my-1">
              <span className="text-gray-500 text-sm">
                {commentStatusLocalization(comment.status)}
              </span>
              <p className="text-sm">{formatDate(comment.createdAt)}</p>
            </div>
            <p className="text-lg">{comment.content}</p>
            {/* Kullanıcı sadece kendi yorumunu yazdığı gün içinde güncelleyebilir */}
            {comment.userId === session?.user.id &&
              formatDate(comment.createdAt) === today && (
                <button
                  className="absolute right-0 top-0 bg-yellow-400 hover:bg-yellow-300 text-white font-semibold px-2 py-1 rounded transition-all ease-in-out duration-500 transform"
                  onClick={() => setEditComment(comment)}
                >
                  Güncelle
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  )
}
export default Comments
