import { useDisclosure, Tr, Td, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast } from "@chakra-ui/react";
import moment from "moment";
import Employee from "../models/Employee";
import TimeKeeping from "../models/TimeKeeping";
import { useState } from "react";
import { TkAuth, checkIn, checkOut } from "../handler";

type TimeKeepingRowProps = {
    th: number,
    employee: Employee,
    timeKeeping?: TimeKeeping,
    auth: TkAuth,
    callback?: () => void
};

function TimeKeepingRow(props: TimeKeepingRowProps) {

    const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: false });
    const { employee, timeKeeping, th, auth } = props;
    const [title, setTitle] = useState("");

    const toast = useToast();

    console.log("TimeKeeping code:" + timeKeeping?.Number);
    let checkInDate: Date | undefined;
    let checkOutDate: Date | undefined;

    if (timeKeeping?.Checkin) {
        checkInDate = moment(timeKeeping?.Checkin, 'dd.MM.YYYY h:mm:ss').toDate();
    }
    if (timeKeeping?.Checkout) {
        if (timeKeeping.Checkout.indexOf("01.01.0001") < 0) {
            checkOutDate = moment(timeKeeping?.Checkout, 'dd.MM.YYYY h:mm:ss').toDate();
        }
    }

    console.log(timeKeeping?.Checkin + " to date:" + checkInDate);

    const onConfirmClick = async () => {
        if (title.toLowerCase().indexOf('out') >= 0) {
            if (checkInDate) {
                console.log(timeKeeping?.Number);
                const result = await checkOut(auth, { Number: timeKeeping?.Number ?? "" });
                onClose();
                toast({
                    title: 'Check out status',
                    description: result ? "Check-out successful!" : "Check-out error!",
                    status: result ? 'success' : 'error',
                    duration: 2500,
                    isClosable: true,
                })
            } else {
                onClose();
                toast({
                    title: 'Check out status',
                    description: "You have not check-in",
                    status: 'warning',
                    duration: 2500,
                    isClosable: true,
                })
                return;
            }
        } else {
            if (checkInDate) {
                onClose();
                toast({
                    title: 'Check in status',
                    description: "You have already check-in",
                    status: 'warning',
                    duration: 2500,
                    isClosable: true,
                })
                return;
            }
            const result = await checkIn(auth);
            onClose();
            toast({
                title: 'Check in status',
                description: result ? "Check-in successful!" : "Check-in error!",
                status: result ? 'success' : 'error',
                duration: 2500,
                isClosable: true,
            })

        }
        if (props.callback) {
            props.callback();
        }
    }
    return (
        <Tr >
            <Td isNumeric>{th}</Td>
            <Td>{employee.Description}</Td>
            <Td textAlign="center">
                {checkInDate ? moment(checkInDate).format('HH:mm:ss') : "--:--:--"}
            </Td>
            <Td textAlign="center">
                {checkOutDate ? moment(checkOutDate).format('HH:mm:ss') : "--:--:--"}
            </Td>
            <Td className="flex justify-center space-x-4">
                <Button
                    colorScheme="blue"
                    textAlign={'center'}
                    onClick={() => {
                        setTitle("Check In");
                        if (!isOpen) {
                            onOpen();
                        }

                    }}>Check In</Button>
                <Button
                    colorScheme="blue"
                    textAlign={'center'}
                    onClick={() => {
                        setTitle("Check Out");
                        if (!isOpen) {
                            onOpen();
                        }
                    }}>Check Out</Button>
            </Td>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <div>Do you want to {title.toLowerCase()} for this person?</div>
                        <div>{employee.Code}  -  {employee.Description}</div>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onConfirmClick}>
                            Confirm
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Tr>
    )
}
export default TimeKeepingRow;