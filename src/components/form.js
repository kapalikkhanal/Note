'use client'
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from "react-redux";
import { addNote, changeUserFormValues, deleteUser } from '@/redux/reducerSlices/taskSlice';
import { IconButton, useDisclosure, Button, ButtonGroup } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
} from '@chakra-ui/react'
import {
    AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton,
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
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const [overlay, setOverlay] = useState(<OverlayOne />)
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);
    const cancelRef = React.useRef()

    return (
        <div>
            {/* text-[#267277] */}
            {/* Add a new note  */}
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
                        onEditOpen()
                    }}
                />
                <h1 className='text-gray-700 mt-1'>Add notes</h1>
                <Modal isCentered isOpen={isEditOpen} onClose={onEditClose}>
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
                                onSubmit={(values, { resetForm }) => {
                                    resetForm();
                                    dispatch(addNote(values));
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
                                                    <button type='button' onClick={onEditClose} className='text-red-800 hover:translate-x-1 hover:-translate-y-1'>Close</button>
                                                    <button type="submit" onClick={onEditClose} className='m-5 hover:translate-x-1 hover:-translate-y-1'>Save</button>
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
            <div className='w-full'>
                {taskDetails.map((item, id) => {
                    return (
                        <div key={id}>
                            <div className='flex justify-between items-center mb-2 shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>

                                <button
                                    onClick={() => {
                                        setSelectedTaskIndex(id);
                                        // setOverlay(<OverlayOne />)
                                        onEditOpen();
                                    }
                                    }
                                    className='flex justify-between items-center pr-7 w-full'
                                >
                                    <div className='flex justify-center flex-col items-start pl-16 w-full p-1.5 hover:translate-x-1'>
                                        <h1 className='first-letter:capitalize text-2xl text-gray-300  rounded-lg hover:text-teal-600'>{item.title}</h1>
                                        <p className='first-letter:capitalize text-gray-700'><TruncateParagraph text={item.body} /> </p>
                                    </div>
                                    {/* <button type='button' onClick={''} className='text-red-800 hover:translate-x-1 hover:-translate-y-1'> Delete</button> */}
                                </button>
                                <div className='pr-10'>
                                    <DeleteIcon w={7} h={7} color={"red.600"} type='button' onClick={onDeleteOpen} />
                                    <AlertDialog
                                        isCentered
                                        isOpen={isDeleteOpen}
                                        leastDestructiveRef={cancelRef}
                                        onClose={onDeleteClose}
                                    >
                                        <AlertDialogOverlay >
                                            <AlertDialogContent color='#267277' bg="gray.800">
                                                <AlertDialogHeader fontSize='lg' fontWeight='bold' color='red.600'>
                                                    Delete
                                                </AlertDialogHeader>

                                                <AlertDialogBody>
                                                    Are you sure? You can't undo this action afterwards.
                                                </AlertDialogBody>

                                                <AlertDialogFooter>
                                                    <Button ref={cancelRef} onClick={onDeleteClose}>
                                                        Cancel
                                                    </Button>
                                                    <Button colorScheme='red' onClick={() => dispatch(deleteUser(id))} ml={3}>
                                                        Delete
                                                    </Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialogOverlay>
                                    </AlertDialog>
                                </div>
                            </div>

                            {
                                selectedTaskIndex === id && (

                                    <div>
                                        <Modal isCentered isOpen={isEditOpen} onClose={onEditClose}>
                                            {overlay}
                                            <ModalContent color='#267277' bg="gray.800">
                                                <ModalHeader></ModalHeader>
                                                <ModalCloseButton />
                                                <ModalBody>
                                                    <Formik
                                                        initialValues={item}
                                                        validationSchema={details}
                                                        onSubmit={(values, { resetForm }) => {
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

                                                                            <button type="submit" onClick={onEditClose} className='m-5 hover:translate-x-1 hover:-translate-y-1'>Save</button>
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
    )
}

export default FormData