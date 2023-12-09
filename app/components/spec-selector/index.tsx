"use client"

import {useState, useEffect, ReactNode} from "react";
import {createBrowserClient } from "@supabase/ssr"
import {Specs, Spec, SpecItems, SpecItem} from "../../../alias";
import {Database} from "../../../database";

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import styles from "./spec-selector.module.css"

const SpecSelector = ({onChange} : {
    onChange:(
        s: Spec | null | undefined) =>void
        }
    ) => {

    const [specs, setSpecs ] = useState<Spec[] | null>(null);
    const [currentSpec, setCurrentSpec] = useState<Spec | null>(null);    
    

    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    const supabase = createBrowserClient<Database, "public">(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const loadSpecs = async () => {
        try {
            const {data, error} = await supabase.from("Spec").select("id, created_at, subject, title");

            if (error) throw error;

            data && setSpecs(data);
        }
        catch(error) {
            console.error(error)
        }
        finally{

        }
    }

    const handleChangeSpec = async (event: SelectChangeEvent<number>, child: ReactNode) => {
        
        // if no specs are loaded, return
        if (!specs) return;

        // get the id (value) of the new selection
        const {target: {value}} = event;
        
        // find the spec that matches the id
        const sp = specs.filter((si:Spec) => si.id === value)[0];

        // update state
        sp && setCurrentSpec(sp);
    
        return;
    }

    

    useEffect(()=> {
        loadSpecs();
    }, [])


    useEffect(()=>{
        
        onChange &&  onChange(currentSpec);

    },[currentSpec]);
    
    return <>
    <h1>Spec Selector</h1>
    <div className={styles.container}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Specification</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentSpec?.id || 0}
          label="Spec"
          onChange={handleChangeSpec}
        >
          {specs && specs.map((s: Spec, i: number) => <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>)}
        </Select>
      </FormControl>
      
    </div>
   
    </>
}

export default SpecSelector;