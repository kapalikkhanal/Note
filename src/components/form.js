'use client'
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { updateLoginForm, changeUserFormValues, deleteUser } from '@/redux/reducerSlices/taskSlice';
import { IconButton, useDisclosure, Button, ButtonGroup } from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
} from '@chakra-ui/react'


const details = Yup.object().shape({
    title: Yup.string()
        .max(50, 'Too Long!'),
    body: Yup.string()
        .max(500, 'Too Long!'),
});

function TruncateParagraph({ text }) {
    const words = text.split(' ');
    if (words.length > 10) {
        const truncatedText = words.slice(0, 10).join(' ');
        return (
            <>
                {truncatedText}...
            </>
        );
    }
    // If the text is shorter than the maximum, display it as is
    return <>{text}</>;
}

function FormData() {
    const dispatch = useDispatch();
    const taskDetails = useSelector(state => state.login.userDetails)

    const OverlayOne = () => (
        <ModalOverlay
            backdropFilter='blur(2px)'
        />
    )
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);

    return (
        <div>
            {/* text-[#267277] */}
            <div className='flex justify-center items-center flex-col mb-8'>
                <h1 className='text-2xl font-extrabold mt-7 text-white'>Notes</h1>
                {/* Add a note button  */}
                <IconButton
                    isRound={true}
                    variant='solid'
                    colorScheme='teal'
                    aria-label='Done'
                    fontSize='20px'
                    icon={<AddIcon />}
                    className='mt-5'
                    onClick={() => {
                        setOverlay(<OverlayOne />)
                        onOpen()
                    }}
                />
                <h1 className='text-gray-700 mt-1'>Add notes</h1>
                <Modal isCentered isOpen={isOpen} onClose={onClose}>
                    {overlay}
                    <ModalContent color='#267277' bg="gray.800">
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* To create a new task  */}
                            <Formik
                                initialValues={{
                                    title: '',
                                    body: '',
                                }}
                                validationSchema={details}
                                onSubmit={(values, {resetForm}) => {
                                    resetForm();
                                    dispatch(updateLoginForm(values));
                                }}
                            >
                                {() => (
                                    <div>
                                        <Form className='flex justify-center flex-col items-center space-y-3'>
                                            <label htmlFor='title'>Title</label>
                                            <Field className='text-gray-400 font-semibold bg-gray-800 rounded-lg border-b-2 border-gray-900 w-full h-10  p-3 focus:outline-none' name="title" placeholder='Add your title here' />

                                            <label htmlFor='body'>Body</label>
                                            <Field
                                                className='text-gray-400 font-semibold bg-gray-800 rounded-lg border-b-2 border-gray-900 w-full h-36  p-3 focus:outline-none'
                                                name="body"
                                                as="textarea"
                                                rows="10" />

                                            <ModalFooter>
                                                <div className='flex justify-center space-x-28'>
                                                    <button type='button' onClick={onClose} className='text-red-800 hover:translate-x-1 hover:-translate-y-1'>Close</button>
                                                    <button type="submit" onClick={onClose} className='m-5 hover:translate-x-1 hover:-translate-y-1'>Save</button>
                                                </div>
                                            </ModalFooter>
                                        </Form>
                                    </div>
                                )}
                            </Formik>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>

            {/* Print tasks  */}
            <div>
                <div>
                    {taskDetails.map((item, id) => {
                        return (
                            <div key={id}>
                                <button

                                    onClick={() => {
                                        setSelectedTaskIndex(id);
                                        // setOverlay(<OverlayOne />)
                                        onOpen();
                                    }
                                    }
                                >
                                    <div className='flex justify-center flex-col items-start mx-10 w-full p-1.5 mb-4 hover:translate-x-1'>
                                        <h1 className='first-letter:capitalize text-2xl text-gray-300  rounded-lg hover:text-teal-600'>{item.title}</h1>
                                        <p className='first-letter:capitalize text-gray-700'><TruncateParagraph text={item.body} /> </p>
                                    </div>
                                </button>

                                {
                                    selectedTaskIndex === id && (

                                        <div>
                                            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                                                {overlay}
                                                <ModalContent color='#267277' bg="gray.800">
                                                    <ModalHeader></ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody>
                                                        <Formik
                                                            initialValues={item}
                                                            validationSchema={details}
                                                            onSubmit={(values, {resetForm}) => {
                                                                resetForm();
                                                                values.id = id;
                                                                dispatch(changeUserFormValues(values));
                                                            }}
                                                        >
                                                            {({ errors, touched }) => (
                                                                <div>
                                                                    <Form className='flex justify-center flex-col items-center space-y-3'>
                                                                        <label htmlFor='title'>Title</label>
                                                                        <Field className='text-gray-400 font-semibold bg-gray-800 rounded-lg border-b-2 border-gray-900 w-full h-10  p-3 focus:outline-none' name="title" placeholder='Add your title here' />
                                                                        

                                                                        <label htmlFor='body'>Body</label>
                                                                        <Field
                                                                            className='text-gray-400 font-semibold bg-gray-800 rounded-lg border-b-2 border-gray-900 w-full h-36  p-3 focus:outline-none'
                                                                            name="body"
                                                                            as="textarea"
                                                                            rows="5" />

                                                                        <ModalFooter>
                                                                            <div className='flex justify-center space-x-28'>
                                                                                <button type='button' onClick={() => {  onClose; dispatch(deleteUser(id)); }} className='text-red-800 hover:translate-x-1 hover:-translate-y-1'> Delete</button>
                                                                                <button type="submit" onClick={onClose} className='m-5 hover:translate-x-1 hover:-translate-y-1'>Save</button>
                                                                            </div>
                                                                        </ModalFooter>
                                                                    </Form>
                                                                </div>
                                                            )}
                                                        </Formik>
                                                    </ModalBody>
                                                </ModalContent>
                                            </Modal>
                                        </div>
                                    )
                                }
                            </div>
                        );
                    })}
                </div>
            </div >

        </div >
    )
}

export default FormData