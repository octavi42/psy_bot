//import liraries
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import React, { Component, use, useState } from 'react';
import { set } from 'zod';


interface AdditionalProps {
    name: string;
    message: string;
    value?: string;
    // Add more custom variables with their data types as needed
}

interface Props {
    title: string;
    description: string;
    placeholder?: string;
    // additional props
    props?: AdditionalProps[];
    className?: string;
}

const HoverCardInput: React.FC<Props> = ({ title, description, placeholder, props }) => {
    return (
        <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant="link">{title}</Button>
                    {/* <h2 className='mb-4 ml-10 max-w-fit'></h2> */}
                </HoverCardTrigger>
                <HoverCardContent className="w-60" align="start" alignOffset={10}>
                    <div className="flex justify-between space-x-4">
                    <div className="space-y-1">
                        {/* <h4 className="text-sm font-semibold">{title}</h4> */}
                        <p className="text-sm">
                        {description}
                        </p>
                        <div className="flex items-center pt-2">
                        <span className="text-xs text-muted-foreground">
                        {props ? (
                        <span className="text-xs text-muted-foreground">
                            {props && props.map((prop, index) => (
                            <React.Fragment key={index}>
                                {prop.message && (
                                <p>
                                    <strong>{prop.message}</strong> {prop.value}
                                </p>
                                )}
                            </React.Fragment>
                            ))}
                        </span>
                        ) : null}
                        </span>
                        </div>
                    </div>
                    </div>
                </HoverCardContent>
            </HoverCard>
    )
}

const InputBox: React.FC<Props> = ({ title, description, placeholder, props, className }) => {
    return (
        <div className={className}>
            <HoverCardInput title={title} description={description} placeholder={placeholder} props={props} />

            <div className="flex w-[80%] m-auto mt-3 mb-3 justify-between">
                <Input className="w-[80%]" type="email" placeholder={placeholder} />
                <Button>Send</Button>
            </div>
        </div>
    );
};

const SliderBox: React.FC<Props> = ({ title, description, placeholder, props, className }) => {
    const [sliderValue, setSliderValue] = useState<number[]>([0.0]);

    return (
        <div className={className}>
            <HoverCardInput title={title} description={description} placeholder={placeholder} props={props} />

            <div className="flex w-[80%] m-auto mt-3 mb-3 justify-between">
                <div className="flex w-[80%] justify-between">
                    <Slider
                        value={sliderValue}
                        min={0}
                        max={1}
                        step={0.1}
                        className="w-[80%]"
                        onValueChange={(value) => {
                            
                            // Assuming that the event object contains the new value as an array
                            setSliderValue(value);

                            console.log(sliderValue);
                            
                        }}
                    />

                    <Input
                        className="w-[15%]"
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={sliderValue[0]}
                        // onChange={event => field.onChange(+event.target.value)}
                        onChange={(event) => {
                            const value = event.target.value;
                            setSliderValue([parseFloat(value)]);
                        }}
                    />
                </div>
                <Button>Send</Button>
            </div>
        </div>
    );
};



const DropDownBox: React.FC<Props> = ({ title, description, placeholder, props, className }) => {
    return (
        <div className={className}>
            <HoverCardInput title={title} description={description} placeholder={placeholder} props={props} />

            <div className="flex w-[80%] m-auto mt-3 mb-3 justify-between">
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Model</SelectLabel>
                        <SelectItem value="gpt-3">gpt-3</SelectItem>
                        <SelectItem value="gpt-4">gpt-4</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button>Send</Button>
            </div>
        </div>
    );
};

//make this component available to the app
export { InputBox, SliderBox, DropDownBox };
