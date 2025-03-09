"use client"
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import Loader from "@/components/loader";

export default function JoinPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  
  useEffect(() => {
    async function handleJoin() {
      if (!id) return;
      
      try {
        setLoading(true);
        const res = await axios.patch(`/teams/join/${id}`)
        if (res.status === 200) {
          setMessage("team joined successfully.");
          setTimeout(() => router.push(`/teams/${id}`), 2000);
        } else {
          setMessage(res.statusText);
          setTimeout(() => router.push(`/teams`), 2000);
        }
      } catch (e) {
        console.error();
        router.push("/teams");
      } finally {
        setLoading(false);
      }
    }
    
    handleJoin();
  }, [id]);
  
  if (loading) return <Loader />;
  
  return (
    <>
      <h1>{message}</h1>
    </>
  )
}