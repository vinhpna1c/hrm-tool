import { Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";

import { useEffect, useState } from "react";

import { getAllCheckInByDate, getAllEmployee } from "../handler";
import Employee from "../models/Employee";
import TimeKeeping from "../models/TimeKeeping";

function EmployeeList() {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [timeKeepings, setTimeKeepings] = useState<TimeKeeping[]>([]);
    const [dataMap, setDataMap] = useState(new Map<String, {
        employee?: Employee,
        timeKeeping?: TimeKeeping,
    }>());
    useEffect(() => {
        getAllEmployee().then((employees) => {
            setEmployees(employees);
        });
        getAllCheckInByDate().then((timeKeepings) => {
            setTimeKeepings(timeKeepings);
        })
    }, [])
    useEffect(() => {
        console.log("Create new Map");
        console.log("Employee list: " + employees.length);
        console.log("TimeKeping list: " + timeKeepings.length);
        const newDataMap = new Map<String, {
            employee?: Employee,
            timeKeeping?: TimeKeeping,
        }>();
        for (const employee of employees) {
            if (employee.Code) {
                newDataMap.set(
                    employee.Code ?? '',
                    {
                        ...newDataMap.get(employee.Code ?? ''),
                        employee,
                    });
            }
        };
        for (const timeKeeping of timeKeepings) {
            if (timeKeeping.Employee) {
                newDataMap.set(
                    timeKeeping.Employee ?? '',
                    {
                        ...newDataMap.get(timeKeeping.Employee ?? ''),
                        timeKeeping
                    })
            }
        }
        console.log("New data map: " + JSON.stringify(newDataMap));
        setDataMap(newDataMap);

    }, [employees, timeKeepings]);
    const keys = [];
    for (const key in dataMap.keys) {
        keys.push(key);
    }
    return <div >
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
                    {keys.map((key, index) => {
                        const data = dataMap.get(key)!;
                        return <TimeKeepingRow key={key} th={index} employee={data.employee!} timeKeeping={data.timeKeeping} />
                    })}
                    <Tr>
                        <Td isNumeric>1</Td>
                        <Td>millimetres (mm)</Td>
                        <Td isNumeric>25.4</Td>
                        <Td >millimetres (mm)</Td>
                        <Td className="flex justify-center space-x-4"><Button>Check In</Button><Button>Check Out</Button></Td>
                    </Tr>

                </Tbody>

            </Table>
        </TableContainer>
    </div>

}

type TimeKeepingRowProps = {
    th: number,
    employee: Employee,
    timeKeeping?: TimeKeeping,
};

function TimeKeepingRow(props: TimeKeepingRowProps) {
    const { employee, timeKeeping, th } = props;
    return (
        <Tr >
            <Td isNumeric>{th}</Td>
            <Td>{employee.Description}</Td>
            <Td isNumeric>25.4</Td>
            <Td >millimetres (mm)</Td>
            <Td className="flex justify-center space-x-4"><Button>Check In</Button><Button>Check Out</Button></Td>
        </Tr>
    )
}

export default EmployeeList;