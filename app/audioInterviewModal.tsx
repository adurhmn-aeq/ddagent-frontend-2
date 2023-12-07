import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import Cookies from "universal-cookie";

export interface Props {
  open:boolean
  link:string
  userId:string
}

export default function AudioInterviewModal(props:Props) {
  const cookies = new Cookies();
  let [isOpen, setIsOpen] = useState(props.open)
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";




  useEffect(() => {
    setIsOpen(props.open);
  }, [props.open]);

  function closeModal() {
    setIsOpen(false)
  }

  // console.log(userData)

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="font-medium text-xl leading-6 text-gray-900 text-center"
                  >
                    Question Created
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-3">
                    Your question interview was created successfully and is now publically accessible from
                    </p>
                    <a 
                    target="_blank"
                    className="text-sm text-blue-600"
                    href={`${baseURL}/base/audio-video/${props.link}?id=${props.userId}`}>{`${baseURL}/base/audio-video/${props.link}?id=${props.userId}`}</a>
                  </div>

                  {/* <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it
                    </button>
                  </div> */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
