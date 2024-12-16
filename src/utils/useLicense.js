import {useEffect, useState} from "react";

const useLicenseScorm = ()=>{

    const fetchLicense = async () => {
        const licenseFile = await fetch("./53049a7d-e5f8-4544-bf35-bafc53eec13e.js");
        const fileData = await licenseFile.json();

        if (!fileData.enabled) return new Promise((resolve) => resolve(true));

        const API_PACKAGER_URL = './';

        const response = await fetch(API_PACKAGER_URL, {
            method: 'POST',
            body: JSON.stringify({file: fileData.file, path: fileData.path})
        });

        if (!response.ok) {
            throw new Error('Failed to fetch License');
        }
        return await response.json();
    }

    const [error, setError] = useState();
    const [isFetching, setIsFetchingLicense] = useState(false);
    const [isLicenseValid, setIsLicenseValid] = useState(false);

    useEffect(() => {
        const fetchLicenseFn = async () => {
            setIsFetchingLicense(true);
            try {
                const isValid = await fetchLicense();
                setIsLicenseValid(isValid);
                // SET license true;
            } catch (error){
                console.log("paosidf", error.message)
                setIsLicenseValid(false);
                setError({message: error.message || 'Failed to fetch License'})
            } finally {
                setIsFetchingLicense(false);
            }
        }
        fetchLicenseFn();
    }, []);

    return {error, isFetching, isLicenseValid};
}

export default useLicenseScorm;
