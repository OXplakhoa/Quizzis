import JoinRoomForm from "@/components/JoinRoomForm";

export default function JoinRoomPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container max-w-2xl mx-auto p-6">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Tham gia phòng
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Nhập mã phòng và tên của bạn để bắt đầu
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <JoinRoomForm />
          </div>
        </div>
      </div>
    </div>
  );
} 