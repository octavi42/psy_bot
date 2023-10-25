"use client"

import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import { requireAdminAuthentication, requireAuthentication, requireContributionAuthentication } from "~/actions/auth";
import {InputBox, SliderBox, DropDownBox} from "~/components/admin/bot/InputBoxes";
import SettingsLayout from "~/components/layouts/SettingsLayout";

import { Button } from "@/components/ui/button"

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export default function AdminBot() {
    const [apiKey, setApiKey] = useState(""); // State variable to store the API key

    // Function to handle changes in the input field and update the state
    const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value);
    };

    const separatorStyle = "w-[80%] m-10 mx-auto";
    const inputStyle = "m-auto mx-10 mt-10 mb-3";

    const { toast } = useToast()

    // useEffect(() => {

    //     toast({
    //         variant: "destructive",
    //         title: "Uh oh! Something went wrong.",
    //         description: "There was a problem with your request.",
    //         action: <ToastAction altText="Try again">Try again</ToastAction>,
    //       })

    // })

    return (


        <div>

            <Button onClick={ () => {
                    toast({
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                      })
            }}> asjdh </Button>

            <InputBox
                className={inputStyle}
                title="OpenAi api key"
                description="Modifica api key-ul pentru a putea folosi bot-ul."
                placeholder="OpenAI api key"
                props={[
                    {name: "apiKey", message:"curent api key:", value: "asdhasjk"},
                    {name: "message", message:"atentie:", value: "nu impartasiti api key-ul cu nimeni!"}
                ]} />

            <Separator className={separatorStyle}/>
            <InputBox
                className={inputStyle}
                title="Costum prompt"
                description="Modifica promptul costum care determina ce va spune bot-ul in cazul in care nu stie raspunsul"
                placeholder="Nu stiu raspunsul"
                props={[
                    {name: "prompt", message:"curent prompt:", value: "Nu stiu raspunsul"},
                ]}/>

            <Separator className={separatorStyle}/>
            <SliderBox
                className={inputStyle}
                title="Temperature"
                description="Modificarea temperaturii determina cat de nebunesc este raspunsul bot-ului"
                props={[
                    {name: "message", message:"atentie:", value: "evita extremele (0.0 - 1.0)"}
                ]}/>

            <Separator className={separatorStyle}/> 
            <DropDownBox
                className={inputStyle}
                title="Model"
                description="Modificarea modelului determina cine raspunde la intrebari"
                placeholder="gpt-3"
                props={[
                    {name: "message", message:"atentie:", value: "modelele au preturi diferite"}
                ]}/>

        </div>
    );
}

AdminBot.PageLayout = SettingsLayout;

export const getServerSideProps = requireAdminAuthentication;
