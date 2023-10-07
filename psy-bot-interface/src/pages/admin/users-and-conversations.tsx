import React, { useState } from "react";
import { requireAdminAuthentication, requireAuthentication, requireContributionAuthentication } from "~/actions/auth";
import { api } from "~/utils/api";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { ScrollArea } from "~/components/ScrollArea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UsersBox from "~/components/admin/UsersBox";
import { Skeleton } from "@/components/ui/skeleton"
import SettingsLayout from "~/components/layouts/SettingsLayout";
import { Input } from "@/components/ui/input";
import LoadingUserBox from "~/components/admin/LoadingUserBox";

interface AdminUsersProps {}

export default function AdminUsers() {
    const {data: users, isLoading} = api.users.getAll.useQuery();

    // array of request server elements, with name and value
    const [reqElems, setReqElems] = useState<{ key: string; value: any }[]>([]);

    return (
        <div className="flex h-screen items-center">
            <main className="flex-grow flex p-6 h-5/6 items-center">
                <div className="relative flex flex-col justify-center items-center w-full h-full">
                    {/* Position the input box relative to the box */}
                    <div className="absolute top-4 right-4 left-4 z-10">
                        <Input type="email" placeholder="User" className="rounded-xl bg-slate-50" />
                    </div>

                    <ScrollArea className="w-full h-full rounded-2xl border-2 p-4 border-gray-800">
                      <div className="mt-10">
                        {isLoading ? (
                            Array.from({ length: 10 }).map((_, index) => (
                                <LoadingUserBox key={index} />
                            ))
                        ) : (
                            /* Render actual users if not loading */
                            users && users.map((user) => (
                                <UsersBox
                                    id={user.id as string}
                                    name={user.name as string}
                                    email={user.email as string}
                                    image={user.image as string}
                                    role={user.role as string}
                                    verified={true}
                                    key={user.id}
                                />
                            ))
                        )}
                      </div>
                    </ScrollArea>
                </div>

                <div className="h-full w-full p-10">
                    asdbkas
                </div>
            </main>
        </div>
    );
}

AdminUsers.PageLayout = SettingsLayout;

export const getServerSideProps = requireAdminAuthentication;
