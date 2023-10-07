import React, { useState } from "react";
// import AdminLayout from "~/pages/admin/sidebar-nav";
import PageContent from "~/components/admin/database/PageContent";
import ObjectList from "~/components/admin/database/ObjectList";
import UploadComponent from "~/components/admin/database/UploadComponent";
import { ScrollProvider } from "~/components/ScrollProvider";
import { requireAdminAuthentication, requireAuthentication, requireContributionAuthentication } from "~/actions/auth";
import SettingsLayout from "~/components/layouts/SettingsLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UsersList from "~/components/admin/database/UsersAndConversations/UsersList";
import ConversationsTable from "~/components/admin/database/UsersAndConversations/ConversationsTable/page";




export default function AdminConversations() {
  return (
    <Tabs defaultValue="account" className="flex flex-col w-[80%] mx-auto h-screen">
        {/* <div className="h-full felx flex-col"> */}

        <TabsList className="grow-0 w-full p-0">
            <TabsTrigger value="account">Users</TabsTrigger>
            <TabsTrigger value="password">Chats</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="grow m-0 h-full">
            <Card className="">
            <CardHeader className="">
                <CardTitle>Users</CardTitle>
                <CardDescription>
                List of all the users and their role in the system.
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                {/* <UsersList /> */}
                <ConversationsTable data="users" />
            </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="password" className="grow m-0 h-full">
            <Card>
            <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>
                    Here you can manage the conversations
                </CardDescription>
            </CardHeader>
            <CardContent className="relative" >
                <ConversationsTable data="chats" />
            </CardContent>
            </Card>
        </TabsContent>

      {/* </div> */}
    </Tabs>
    
  )
};


AdminConversations.PageLayout = SettingsLayout


export const getServerSideProps = requireAdminAuthentication;