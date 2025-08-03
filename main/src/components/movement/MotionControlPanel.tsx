import React, { useState } from 'react';

interface MotionControlPanelProps {
  onMotionParamsChange: (params: MotionParams) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export interface MotionParams {
  speedBase: number;
  followSpeedMultiplier: number;
  followSpeedOffset: number;
  colorInterpolationPower: number;
  stepReductionRatio: number;
  borderRadiusOuter: number;
  dragSmoothing: number;
}

export function MotionControlPanel({ onMotionParamsChange, isVisible, onToggle }: MotionControlPanelProps) {
  const [params, setParams] = useState<MotionParams>({
    speedBase: 0.08,              // 기본 애니메이션 속도
    followSpeedMultiplier: 0.5,   // 팔로우 속도 배수
    followSpeedOffset: 1.0,       // 팔로우 속도 오프셋
    colorInterpolationPower: 0.9, // 컬러 보간 곡선
    stepReductionRatio: 0.06,     // 스텝 크기 감소 비율
    borderRadiusOuter: 8,         // 바깥 사각형 모서리 둥글기
    dragSmoothing: 1.0,           // 드래그 부드러움 정도
  });

  const handleParamChange = (key: keyof MotionParams, value: number) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onMotionParamsChange(newParams);
  };

  const resetToDefault = () => {
    const defaultParams: MotionParams = {
      speedBase: 0.08,
      followSpeedMultiplier: 0.5,
      followSpeedOffset: 1.0,
      colorInterpolationPower: 0.9,
      stepReductionRatio: 0.06,
      borderRadiusOuter: 8,
      dragSmoothing: 1.0,
    };
    setParams(defaultParams);
    onMotionParamsChange(defaultParams);
  };

  const copyParams = () => {
    const paramsString = JSON.stringify(params, null, 2);
    navigator.clipboard.writeText(paramsString);
    alert('Parameters copied to clipboard!');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-black text-white px-3 py-2 rounded-lg shadow-lg transition-colors"
      >
        {isVisible ? '모션 패널 닫기' : '모션 패널 열기'}
      </button>

      {/* Control Panel */}
      {isVisible && (
        <div className="fixed top-16 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-40 max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">컨트롤 패널</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Animation Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Animation Speed: {params.speedBase.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.3"
                step="0.005"
                value={params.speedBase}
                onChange={(e) => handleParamChange('speedBase', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>느림 (0.01)</span>
                <span>빠름 (0.3)</span>
              </div>
            </div>

            {/* Follow Speed Multiplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow Speed Multiplier: {params.followSpeedMultiplier.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={params.followSpeedMultiplier}
                onChange={(e) => handleParamChange('followSpeedMultiplier', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>독립적 (0.1)</span>
                <span>강한 연결 (2.0)</span>
              </div>
            </div>

            {/* Follow Speed Offset */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow Speed Offset: {params.followSpeedOffset.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.followSpeedOffset}
                onChange={(e) => handleParamChange('followSpeedOffset', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>균등함 (0.1)</span>
                <span>차등 강함 (3.0)</span>
              </div>
            </div>

            {/* Color Interpolation Power */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Curve: {params.colorInterpolationPower.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.colorInterpolationPower}
                onChange={(e) => handleParamChange('colorInterpolationPower', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Linear (0.1)</span>
                <span>Curved (3.0)</span>
              </div>
            </div>

            {/* Step Reduction Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size Reduction: {params.stepReductionRatio.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.02"
                max="0.15"
                step="0.005"
                value={params.stepReductionRatio}
                onChange={(e) => handleParamChange('stepReductionRatio', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>작은 차이 (0.02)</span>
                <span>큰 차이 (0.15)</span>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius: {params.borderRadiusOuter}px
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={params.borderRadiusOuter}
                onChange={(e) => handleParamChange('borderRadiusOuter', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>사각형 (0)</span>
                <span>둥글게 (30)</span>
              </div>
            </div>

            {/* Drag Smoothing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Drag Smoothing: {params.dragSmoothing.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.dragSmoothing}
                onChange={(e) => handleParamChange('dragSmoothing', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>민감함 (0.1)</span>
                <span>부드러움 (3.0)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={resetToDefault}
              className="flex-1 bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={copyParams}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm"
            >
              Copy Values
            </button>
          </div>

          {/* Current Values Display */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Values:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}