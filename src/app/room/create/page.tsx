import CreateRoomButton from "@/components/CreateRoomButton";

export default function CreateRoomPage() {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Tạo phòng mới</h1>
        <p className="text-gray-500">
          Tạo phòng và mời bạn bè tham gia cùng bạn
        </p>
        <CreateRoomButton />
      </div>
    </div>
  );
} 