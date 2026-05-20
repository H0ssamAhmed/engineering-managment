import { Archive, ArchiveRestore, Bell, Trash2 } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { formateDateGetDay, Notification, ROUTE_PATHS } from '@/lib'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty"
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
const UserNotification = () => {
  const { currentUserNotifaction } = useUsers()
  const read = currentUserNotifaction.filter((notifi) => (notifi.is_read))
  const unread = currentUserNotifaction.filter((notifi) => (!notifi.is_read))


  return (
    <DropdownMenu dir='rtl'>
      <DropdownMenuTrigger>
        <div className='relative w-10 h-10 flex items-center justify-center hover:bg-primary/10 rounded-md'>
          <Bell size={20} />
          <span className={cn("absolute -top-3 -right-3 w-8 h-8 flex items-center justify-center text-md text-primary bg-primary/10 rounded-full border-2 border-background",
            unread.length > 0 && "animate-pulse bg-red-500 text-white font-bold")}>{unread.length || 0}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen md:w-96  max-h-96 overflow-auto">
        <DropdownMenuGroup>
          <DropdownMenuLabel>الاشعارات الغير مقروءة</DropdownMenuLabel>
          {
            unread.length == 0
              ? <EmptyNotification />
              :
              unread.map((notification) => <NotificationRow key={notification.id} notification={notification} />)}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {read.length > 0 && <DropdownMenuGroup>
          <DropdownMenuLabel>الاشعارات المقروءة</DropdownMenuLabel>
          {read.map((notification) => <NotificationRow key={notification.id} notification={notification} />)}
        </DropdownMenuGroup>}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserNotification


const NotificationRow = ({ notification }: { notification: Notification }) => {
  const { changeNotificationState, deleteTheNotification } = useUsers()
  const handleMarkAsRead = () => {
    changeNotificationState({ id: notification.id, is_read: !notification.is_read })
  };

  return (
    <DropdownMenuCheckboxItem
      checked={notification.is_read}
      onCheckedChange={handleMarkAsRead}
      className={cn('flex items-center gap-4 py-4 my-2 border-b bg-gray-50 last:border-b-0  ', notification.is_read && "opacity-50")}
    >
      <div className='flex items-center'>
        <Bell size={30} className={cn(!notification.is_read && "text-red-500 font-bold animate-bounce")} />
      </div>
      <div className='flex flex-col items-center gap-4 w-full'>
        <div className='flex items-start flex-col gap-4 w-full justify-between'>
          <p>{notification.message}</p>
          <p className='text-gray-500 py-2 text-sm col-span-3'>{formateDateGetDay(notification.created_at)}</p>
        </div>
        <div className='flex items-center justify-center md:justify-end gap-4 w-full'>
          <Link className='text-gray-800 text-sm p-0 text-center font-semibold' to={ROUTE_PATHS.PROJECTS + "/" + notification.project_id || ROUTE_PATHS.DASHBOARD}>
            <Button variant="link" size='sm' className='p-0 text-sm underline  cursor-pointer'>
              عرض المرحلة
            </Button>
          </Link>
          <Button
            onClick={handleMarkAsRead}
            variant="secondary" size='sm' className='cursor-pointer w-fit'>
            <HintTooltip id={notification.id} value={notification.is_read} />
          </Button>

          <Button
            onClick={() => deleteTheNotification(notification.id)}
            variant="destructive" size='sm' className='cursor-pointer  w-fit'>
            <Trash2 />
          </Button>
        </div>
      </div>
    </DropdownMenuCheckboxItem>)

}
function EmptyNotification() {
  return (
    <Empty className='h-4'>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Bell />
        </EmptyMedia>
        <EmptyTitle> لا يوجد اشعارات جديدة </EmptyTitle>
      </EmptyHeader>
    </Empty>
  )
}


const HintTooltip = ({ value, id }: { value: boolean, id: string }) => {
  const { changeNotificationState } = useUsers()
  const handleMarkAsRead = () => {
    changeNotificationState({ id: id, is_read: !value })
  };
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        <Button
          onClick={handleMarkAsRead}
          variant="secondary" size='sm' className='cursor-pointer w-fit p-0'>
          {value ? <Archive /> : <ArchiveRestore />}
        </Button>

      </TooltipTrigger>
      <TooltipContent>
        <span>تميز كــ {value ? "غير مقروء" : "مقروء"}</span>
      </TooltipContent>
    </Tooltip>
  )
}