'use client';

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import Container from '@/components/ui/container';
import { Calendar } from '@/components/ui/calendar';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import CloseButton from '@/components/ui/button/close-button';
import { Button } from '@/components/ui/button/button';
import Heading from '@/components/ui/heading';
import { useUiLayoutStore } from '@/store/ui-layout';
import moment from 'moment';
import { useBookStore } from '@/providers/store-providers/book-provider';
import axios from 'axios';
import { bookingUrl2, unitPublicUrl } from '@/lib/data/endpoints';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  user: any;
  dates: string;
}
type TypeToogleItem = {
  label: string;
  hour: string;
  total_unit: number;
  unit_rest: number;
}
const toggleItems = [
  {
    label: "6:00AM",
    value: "6"
  },
  {
    label: "7:00AM",
    value: "7"
  },
  {
    label: "8:00AM",
    value: "8"
  },
  {
    label: "9:00AM",
    value: "9"
  },
  {
    label: "10:00AM",
    value: "10"
  },
  {
    label: "11:00AM",
    value: "11"
  },
  {
    label: "1:00PM",
    value: "13"
  },
  {
    label: "2:00PM",
    value: "14"
  },
  {
    label: "3:00PM",
    value: "15"
  },
  {
    label: "4:00PM",
    value: "16"
  }
];
function DatesFormModal({
  user,
  dates,
}: Props) {
  const latestRequestRef = React.useRef<number>(0);
  const { updateBookingField, bookingField } = useBookStore(state => state)
  const { showModal, closeModal } = useUiLayoutStore(state => state);
  const [date, setDate] = React.useState<Date | undefined>(dates ? new Date(dates) : undefined);
  const [time, setTime] = React.useState<number>(6);

  const [sumHour, setSumHour] = React.useState<TypeToogleItem[]>([]);
  const [loadingTime, setLoadingTime] = React.useState<boolean>(false);

  const isTimeDisabled = (timeValue: string) => {
    if (!date) return true;

    const selectedDate = moment(date).format('YYYY-MM-DD');
    const currentDate = moment().format('YYYY-MM-DD');
    const currentHour = moment().hour();
    const currentMinute = moment().minute();

    // Disable past hours if the selected date is today
    if (selectedDate === currentDate) {
      if (parseInt(timeValue) === currentHour) {
        return currentMinute > 0;
      }
      return parseInt(timeValue) < currentHour;
    }

    return false;
  };

  const setDefaultHour = () => {
    if (!date) return
    const hour = date.getHours()
    return hour.toString()
  }

  const handleValueChange = (val: string) => {
    if (!val) return
    const dateWithHour = date?.setHours(parseInt(val));
    const newDate = moment(dateWithHour).format('YYYY-MM-DD H:mm:ss')
    console.log('newDate', newDate)
    updateBookingField({
      schedule_check_in_date: newDate
    })
    closeModal();
  }
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setTime(6);
  };

  const getUnitAvail = async () => {
    try {
      const res = await axios.post(unitPublicUrl + '/unit/available', { org_no: user?.org_no || "C0003" }, {
        headers: { Accept: 'application/json' }
      });
      if (res.data) {
        return res.data.total;
      }
    } catch (error: any) {
      console.log(error);
    }
  }
  const setSummaryHour = async (dateVal: any) => {
    const requestId = Date.now();
    latestRequestRef.current = requestId;

    setLoadingTime(true);
    const totalUnit = await getUnitAvail() || 0;
    const body = {
      date: dateVal,
      org_no: user?.org_no || "C0003"
    }
    if (dateVal) {
      const dateFormat = moment(dateVal).format('YYYY-MM-DD')
      body.date = dateFormat
    } else {
      body.date = moment().format('YYYY-MM-DD')
    }
    try {
      const res = await axios.post(bookingUrl2 + '/book/summary-hour', body, {
        headers: { Accept: 'application/json' }
      });

      if (latestRequestRef.current !== requestId) {
        return null;
      }

      const dataRaw = res.data.data
      if (dataRaw) {
        const formatData = dataRaw.map((item: any) => {
          // add label
          const hourNum = parseInt(item.hour, 10);
          const isPM = hourNum >= 12;
          const displayHour = hourNum % 12 === 0 ? 12 : hourNum % 12;
          const label = `${displayHour}:00${isPM ? "PM" : "AM"}`;
          // add unit rest
          let unitRest;
          if (totalUnit) {
            unitRest = totalUnit - item.total_unit
          } else {
            unitRest = 0
          }
          return { ...item, label: label, unit_rest: unitRest }
        })
        setSumHour(formatData);
      }
      return res.data;
    } catch (error: any) {
      console.log('Error fetching summary hour:', error);
      return [];
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoadingTime(false);
      }
    }
  }

  /*
  # Ini apabila pakai mode select Button

  const handleValueChange = (val: string) => {
    setTime(parseInt(val));
  }
  const dateWithHours = () => {
    const dateSetHours = date?.setHours(time);
    return dateSetHours;
  }
  const handleSave = () => {
    const newDate = moment(dateWithHours()).format('YYYY-MM-DD H:mm:ss')
    console.log(newDate)
    updateBookingField({
      schedule_check_in_date: newDate
    });
    closeModal();
  }

  */

  React.useEffect(() => {
    setSummaryHour(date);
    console.log(user.org_no)
  }, [date])

  return (
    <Sheet
      open={showModal}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          closeModal();
        }
      }}
    >
      <SheetContent side="bottom" className="wrapper flex flex-col justify-between w-full h-3/4 rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="text-center text-foreground/75">Dates</SheetTitle>
        </SheetHeader>
        <ScrollArea className="">
          <form className="pb-10 px-4">
            <div className="relative flex flex-col justify-center w-full mx-auto">
              <div className="mt-6 w-full">
                <h4 className="text-sm font-semibold truncate">
                  Select Date
                </h4>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="mt-4 rounded-md border border-slate-200"
                />
              </div>
              <div className="mt-6 w-full">
                <h4 className="text-sm font-semibold truncate">
                  Select Time
                </h4>
                {loadingTime ? (
                  <div className="flex-col mt-4 space-y-2">
                    <Skeleton className="h-10 w-5/6 rounded-sm" />
                    <Skeleton className="h-10 w-11/12 rounded-sm" />
                    <Skeleton className="h-10 w-3/5 rounded-sm" />
                  </div>
                ) : (
                  <ToggleGroup
                    defaultValue={setDefaultHour()}
                    type="single"
                    variant="custom"
                    className="flex-wrap justify-start mt-4 gap-2 text-xs text-foregorund/50 rounded-sm"
                    onValueChange={value => handleValueChange(value)}
                  >
                    {sumHour.map((item, idx) => (
                      <ToggleGroupItem
                        key={idx}
                        value={item.hour}
                        disabled={isTimeDisabled(item.hour) || item.unit_rest === 0}
                      >
                        {item.label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                )}
              </div>
              {/* <div className="flex items-center justify-center mt-6 w-full">
                <Button
                  type='button'
                  className="bg-brand hover:bg-brand/90"
                  onClick={handleSave}
                >Select</Button>
              </div> */}
            </div>
          </form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default DatesFormModal;