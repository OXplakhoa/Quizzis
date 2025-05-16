import JoinRoomForm from "@/components/JoinRoomForm";

interface JoinRoomPageProps {
  params: {
    code: string;
  };
}

export default function JoinRoomPage({ params }: JoinRoomPageProps) {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Tham gia phòng</h1>
        <p className="text-gray-500">
          Nhập tên của bạn để bắt đầu
        </p>
        <JoinRoomForm />
      </div>
    </div>
  );
} 