import { AlertTriangle, Clock, Cpu, HardDrive, Activity, Wifi } from 'lucide-react';
import type { AlertRecord } from '../types';

interface Props {
  alerts: AlertRecord[];
}

function MetricIcon({ metric }: { metric: AlertRecord['metric'] }) {
  const map = {
    cpu: <Cpu size={14} />,
    memory: <Activity size={14} />,
    disk: <HardDrive size={14} />,
    network: <Wifi size={14} />,
  };
  return map[metric];
}

function formatValue(metric: AlertRecord['metric'], value: number): string {
  if (metric === 'network') {
    const mb = value / 1024 / 1024;
    return `${mb.toFixed(1)} MB/s`;
  }
  return `${value}%`;
}

export default function AlertHistory({ alerts }: Props) {
  return (
    <div className="bg-panel-bg rounded-xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <AlertTriangle size={16} className="text-danger" />
          告警历史
        </h3>
        <span className="text-xs text-gray-500">共 {alerts.length} 条记录</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm gap-2">
            <AlertTriangle size={24} className="opacity-40" />
            <span>暂无告警记录</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-danger/5 border border-danger/20 rounded-lg p-3 hover:bg-danger/10 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-danger"><MetricIcon metric={alert.metric} /></span>
                  <span className="text-sm font-medium text-gray-200">{alert.serverName}</span>
                  <span className="text-xs text-danger bg-danger/10 px-1.5 py-0.5 rounded">
                    {alert.metricLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} />
                  <span title={alert.timestampFull}>{alert.timestamp}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                当前值 <span className="text-danger font-medium">{formatValue(alert.metric, alert.value)}</span>
                {' / '}
                阈值 {formatValue(alert.metric, alert.threshold)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
