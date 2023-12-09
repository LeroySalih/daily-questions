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
import styles from "./spec-item-selector.module.css"

const SpecItemSelector = ({onChange} : {
    onChange:(
        s: Spec | null | undefined, 
        si: SpecItem | null | undefined) =>void
        }
    ) => {

    const [specId, setSpecId] = useState<number | null>(null);
    const [specs, setSpecs ] = useState<Spec[] | null>(null);
    const [specItems, setSpecItems] = useState<SpecItem[] | null>(null);

    const [currentSpec, setCurrentSpec] = useState<Spec | null>(null);    
    const [currentSpecItem, setCurrentSpecItem] = useState<SpecItem | null>(null);


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

    const loadSpecItems = async () => {
        try {
            const {data, error} = await supabase.from("SpecItem").select("id, created_at, SpecId, tag, title, revisionMaterials ");

            if (error) throw error;

            data && setSpecItems(data);
        }
        catch(error) {
            console.error(error)
        }
        finally{

        }
    }

    const handleChangeSpec = async (event: SelectChangeEvent<number>, child: ReactNode) => {
        
        const {target: {value}} = event;
        
        if (!specs) return;

        const spi = specs.filter((si:Spec) => si.id === value)[0];
        spi && setCurrentSpec(spi);
        

        return;
    }

    const handleSpecItemChange = async (event: SelectChangeEvent<number>, child: ReactNode) => {

        const {target: {value}} = event;
        
        if (!specs) return;

        const spi = specs.filter((si:Spec) => si.id === value)[0];
        spi && setCurrentSpec(spi);

        return;
    }

    const handleChangeSpecItem = async (event: SelectChangeEvent<number>, child: ReactNode) => {
        
        const csi = specItems?.filter((si:SpecItem) => si.id == event.target.value)[0];
        
        csi && setCurrentSpecItem(csi);

    }

    useEffect(()=> {
        loadSpecs();
    }, [])

    useEffect(()=> {
        loadSpecItems();
    }, [specs])

    useEffect(()=>{
        
        const firstSpecItem = specItems?.sort((a:SpecItem, b:SpecItem) => a.tag! > b.tag! ? 1 : -1)
                .filter((si:SpecItem) => si.SpecId === currentSpec?.id)[0]

        setCurrentSpecItem(firstSpecItem || null);

    },[currentSpec]);

    useEffect(()=> {
        onChange &&  onChange(currentSpec, currentSpecItem);
    }, [currentSpecItem])


    
    return <>
    <h1>Spec Item Selector</h1>
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
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Spec Item</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentSpecItem?.id || 0}
          label="Spec Item"
          onChange={handleChangeSpecItem}
        >
          {specItems && specItems
            .filter((si: SpecItem) => si.SpecId === currentSpec?.id)
            .sort((a:SpecItem, b:SpecItem) => a.tag! > b.tag! ? 1 : -1)
            .map((si: SpecItem, i: number) => <MenuItem key={si.id} value={si.id}>({si.tag}) {si.title}</MenuItem>)}
        </Select>
      </FormControl>
    </div>
   
    </>
}

export default SpecItemSelector;