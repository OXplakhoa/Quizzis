import HostScreen from "@/components/HostScreen";

interface HostScreenPageProps {
  params: {
    code: string;
  };
}

export default function HostScreenPage({ params }: HostScreenPageProps) {
  return <HostScreen roomCode={params.code} />;
} 