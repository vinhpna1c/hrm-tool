import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Th, Thead, Tr, useDisclosure, } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { getAllCheckInByDate, getAllEmployee } from "../handler";
import Employee from "../models/Employee";
import TimeKeeping from "../models/TimeKeeping";
import TimeKeepingRow from "./TimeKeepingRow";


function EmployeeList() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [timeKeepings, setTimeKeepings] = useState<TimeKeeping[]>([]);

    let _username = "";
    let _password = "";


    useEffect(() => {
        fetchCheckInData();
        fetchEmployeeData();
    }, [])


    const fetchEmployeeData = async () => {
        const employeeList = await getAllEmployee();
        setEmployees(employeeList);
    }

    const fetchCheckInData = async () => {
        const timeKeepingList = await getAllCheckInByDate();
        setTimeKeepings(timeKeepingList);
    }

    const onCredetialPress = () => {
        setUsername(_username);
        setPassword(_password);
    }

    return (
        <div >

            <div className="flex flex-col p-4 mb-5">
                <span className="font-semibold">Username: </span>
                <Input className="mb-2" placeholder="Input user name..." onChange={(value) => _username = value.target.value} />
                <span className="font-semibold">Password: </span>
                <Input className="mb-2" placeholder="" type="password" onChange={(value) => _password = value.target.value} />
                <Button colorScheme="whatsapp" onClick={onCredetialPress}>Set Credentials</Button>

                {(username.length > 0 && password.length > 0) && <div className="flex justify-start items-center">
                    <span className="font-semibold mr-1">Username: </span>
                    <p className="italic mr-3">{username}</p>
                    <span className="font-semibold mr-1">Password: </span>
                    <p className="italic">{password}</p>
                </div>}
                <span className="italic text-xs">
                    P/s: Input "username" and "password" anh click on set up to use
                </span>
            </div>

            <TableContainer>
                <Table size='lg'>
                    <Thead>
                        <Tr>
                            <Th isNumeric>TH</Th>
                            <Th>Employee</Th>
                            <Th>Check In Time</Th>
                            <Th>Check Out Time</Th>
                            <Th className="flex justify-center">Actions</Th>

                        </Tr>
                    </Thead>
                    <Tbody>
                        {employees.map((e, index) => {

                            const timeKeeping = timeKeepings.find((t) => t.Employee == e.Code);

                            return <TimeKeepingRow auth={{ username, password }} key={index} th={index + 1} employee={e} timeKeeping={timeKeeping} callback={() => fetchCheckInData()} />
                        })}


                    </Tbody>

                </Table>
            </TableContainer>



        </div >)

}


export default EmployeeList;